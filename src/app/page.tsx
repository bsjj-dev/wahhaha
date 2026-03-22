"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Lobby from "@/components/Lobby";
import RoundTable, { type Participant } from "@/components/RoundTable";
import Chat, { type ChatMessage } from "@/components/Chat";
import Menu from "@/components/Menu";
import Toolbar from "@/components/Toolbar";
import StaffMessage from "@/components/StaffMessage";
import { type MenuItem } from "@/data/menu";
import { staff, getRandomStaff, getRandomResponse } from "@/data/staff";

interface StaffNotification {
  id: string;
  staffName: string;
  staffAvatar: string;
  message: string;
}

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  // Media state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Data channel for peer-to-peer messaging
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannels = useRef<Map<string, RTCDataChannel>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize local media and signaling
  const joinRoom = useCallback(async (name: string, room: string) => {
    setUserName(name);
    setRoomCode(room);

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("No media devices (HTTP on iOS?)");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      const selfParticipant: Participant = {
        id: "self",
        name: name,
        videoTrack: stream.getVideoTracks()[0] || null,
        audioTrack: stream.getAudioTracks()[0] || null,
        isSelf: true,
      };
      setParticipants([selfParticipant]);
      setJoined(true);

      // Connect to signaling server
      connectSignaling(name, room, stream);
    } catch {
      // If camera/mic fails, still join with no media
      const selfParticipant: Participant = {
        id: "self",
        name: name,
        isSelf: true,
      };
      setParticipants([selfParticipant]);
      setJoined(true);

      connectSignaling(name, room, null);
    }

    // Greet from Yu
    const yu = staff[0];
    setTimeout(() => {
      addStaffNotification(yu.name, yu.avatar, yu.greeting);
      addStaffChat(yu.name, yu.greeting);
    }, 1500);
  }, []);

  // WebSocket signaling for peer connections
  const connectSignaling = useCallback((name: string, room: string, stream: MediaStream | null) => {
    // Derive signaling URL from the page's own host so it works on any machine
    const signalingHost = process.env.NEXT_PUBLIC_SIGNALING_URL
      || `ws://${window.location.hostname}:8080`;

    const ws = new WebSocket(signalingHost);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", room, name }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "peer-joined": {
          // Create offer for new peer
          const pc = createPeerConnection(msg.peerId, msg.name, stream, ws);
          peerConnections.current.set(msg.peerId, pc);

          const dc = pc.createDataChannel("chat");
          setupDataChannel(dc, msg.peerId);
          dataChannels.current.set(msg.peerId, dc);

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({
            type: "offer",
            to: msg.peerId,
            offer: pc.localDescription,
          }));
          break;
        }
        case "offer": {
          const pc = createPeerConnection(msg.from, msg.name, stream, ws);
          peerConnections.current.set(msg.from, pc);

          pc.ondatachannel = (e) => {
            setupDataChannel(e.channel, msg.from);
            dataChannels.current.set(msg.from, e.channel);
          };

          await pc.setRemoteDescription(msg.offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(JSON.stringify({
            type: "answer",
            to: msg.from,
            answer: pc.localDescription,
          }));
          break;
        }
        case "answer": {
          const pc = peerConnections.current.get(msg.from);
          if (pc) await pc.setRemoteDescription(msg.answer);
          break;
        }
        case "ice-candidate": {
          const pc = peerConnections.current.get(msg.from);
          if (pc) await pc.addIceCandidate(msg.candidate);
          break;
        }
        case "peer-left": {
          peerConnections.current.get(msg.peerId)?.close();
          peerConnections.current.delete(msg.peerId);
          dataChannels.current.delete(msg.peerId);
          setParticipants((prev) => prev.filter((p) => p.id !== msg.peerId));
          break;
        }
      }
    };
  }, []);

  const createPeerConnection = (
    peerId: string,
    peerName: string,
    localStream: MediaStream | null,
    ws: WebSocket,
  ): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
      // Always gather local (host) candidates so LAN connections work
      // even when STUN is unreachable or returns unhelpful public IPs
      iceCandidatePoolSize: 10,
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        ws.send(JSON.stringify({
          type: "ice-candidate",
          to: peerId,
          candidate: e.candidate,
        }));
      }
    };

    pc.ontrack = (e) => {
      const stream = e.streams[0];
      setParticipants((prev) => {
        const existing = prev.find((p) => p.id === peerId);
        if (existing) {
          return prev.map((p) =>
            p.id === peerId
              ? {
                  ...p,
                  videoTrack: stream.getVideoTracks()[0] || null,
                  audioTrack: stream.getAudioTracks()[0] || null,
                }
              : p,
          );
        }
        return [
          ...prev,
          {
            id: peerId,
            name: peerName,
            videoTrack: stream.getVideoTracks()[0] || null,
            audioTrack: stream.getAudioTracks()[0] || null,
          },
        ];
      });
    };

    return pc;
  };

  const setupDataChannel = (dc: RTCDataChannel, _peerId: string) => {
    dc.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "chat") {
        setChatMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: msg.sender,
            text: msg.text,
            timestamp: Date.now(),
          },
        ]);
      } else if (msg.type === "order") {
        // Show other person's order
        const s = getRandomStaff();
        addStaffChat(s.name, `${msg.sender} ordered ${msg.itemName}!`);
      }
    };
  };

  // Broadcast message to all peers
  const broadcast = useCallback((data: object) => {
    const payload = JSON.stringify(data);
    dataChannels.current.forEach((dc) => {
      if (dc.readyState === "open") dc.send(payload);
    });
  }, []);

  // Chat
  const handleSendChat = useCallback(
    (text: string) => {
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: userName,
        text,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, msg]);
      broadcast({ type: "chat", sender: userName, text });
    },
    [userName, broadcast],
  );

  // Staff helpers
  const addStaffNotification = (staffName: string, staffAvatar: string, message: string) => {
    const id = crypto.randomUUID();
    setStaffNotifications((prev) => [...prev, { id, staffName, staffAvatar, message }]);
  };

  const addStaffChat = (staffName: string, text: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: staffName,
        text,
        timestamp: Date.now(),
        isStaff: true,
      },
    ]);
  };

  const dismissNotification = useCallback((id: string) => {
    setStaffNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Order food
  const handleOrder = useCallback(
    (item: MenuItem) => {
      const s = getRandomStaff();
      const response = getRandomResponse(s.orderResponses);

      addStaffNotification(s.name, s.avatar, response);
      addStaffChat(s.name, `${userName} ordered ${item.name} — ${response}`);

      broadcast({ type: "order", sender: userName, itemName: item.name });

      // Food takes suspiciously long to arrive (30s - 2min)
      const deliveryTime = 30000 + Math.random() * 90000;

      // "Still working on it" check-in halfway through
      setTimeout(() => {
        const waitStaff = getRandomStaff();
        const waitLine = getRandomResponse(waitStaff.waitingLines);
        addStaffNotification(waitStaff.name, waitStaff.avatar, waitLine);
        addStaffChat(waitStaff.name, waitLine);
      }, deliveryTime * 0.4 + Math.random() * 5000);

      // Maybe a second check-in if it's really long
      if (deliveryTime > 60000) {
        setTimeout(() => {
          const waitStaff = getRandomStaff();
          const waitLine = getRandomResponse(waitStaff.waitingLines);
          addStaffChat(waitStaff.name, waitLine);
        }, deliveryTime * 0.7 + Math.random() * 5000);
      }

      // Food finally arrives
      setTimeout(() => {
        const servingStaff = getRandomStaff();
        const servingLine = getRandomResponse(servingStaff.servingLines);
        addStaffNotification(servingStaff.name, servingStaff.avatar, servingLine);
        addStaffChat(servingStaff.name, `Serving ${item.name} to ${userName} — ${servingLine}`);

        setParticipants((prev) =>
          prev.map((p) => (p.id === "self" ? { ...p, orderedFood: item.name } : p)),
        );
      }, deliveryTime);
    },
    [userName, broadcast],
  );

  // Toggle mic/cam
  const toggleMic = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMicEnabled((prev) => !prev);
    }
  }, [localStream]);

  const toggleCam = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setCamEnabled((prev) => !prev);
    }
  }, [localStream]);

  // Leave
  const handleLeave = useCallback(() => {
    localStream?.getTracks().forEach((t) => t.stop());
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    dataChannels.current.clear();
    wsRef.current?.close();
    setJoined(false);
    setParticipants([]);
    setChatMessages([]);
    setLocalStream(null);
  }, [localStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      wsRef.current?.close();
    };
  }, [localStream]);

  if (!joined) {
    return <Lobby onJoin={joinRoom} />;
  }

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Main area - table */}
      <div className="flex-1 relative">
        {/* Room header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="text-xs text-[var(--wah-gold)]/60 font-semibold">
            THE BACK ROOM
          </div>
          <div className="text-[10px] text-[var(--wah-cream)]/30">
            Room: {roomCode} &bull; {participants.length}/10 seated
          </div>
        </div>

        {/* Round table with participants */}
        <div className="absolute inset-0 z-0">
          <RoundTable
            participants={participants}
            menuOpen={menuOpen}
            onOpenMenu={() => setMenuOpen(true)}
          />
        </div>

        {/* Toolbar */}
        <Toolbar
          micEnabled={micEnabled}
          camEnabled={camEnabled}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          onOpenMenu={() => setMenuOpen(true)}
          onLeave={handleLeave}
        />

        {/* Staff notifications */}
        {staffNotifications.length > 0 && (
          <StaffMessage
            key={staffNotifications[staffNotifications.length - 1].id}
            {...staffNotifications[staffNotifications.length - 1]}
            onDismiss={() =>
              dismissNotification(staffNotifications[staffNotifications.length - 1].id)
            }
          />
        )}
      </div>

      {/* Chat sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:block w-72 lg:w-80 shrink-0">
        <Chat messages={chatMessages} onSend={handleSendChat} currentUser={userName} />
      </div>

      {/* Mobile chat toggle button */}
      <button
        className="md:hidden absolute bottom-20 right-4 z-30 w-12 h-12 rounded-full bg-[var(--wah-dark)]/90 border border-[var(--wah-wood)] flex items-center justify-center text-xl"
        onClick={() => setChatOpen((o) => !o)}
      >
        💬
        {chatMessages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--wah-red)] text-[8px] flex items-center justify-center text-white font-bold">
            {chatMessages.length > 9 ? "9+" : chatMessages.length}
          </span>
        )}
      </button>

      {/* Mobile chat drawer */}
      {chatOpen && (
        <div className="md:hidden absolute inset-0 z-40 flex flex-col">
          <div className="flex-1 bg-black/40" onClick={() => setChatOpen(false)} />
          <div className="h-[60%] bg-[var(--wah-dark)]">
            <Chat messages={chatMessages} onSend={handleSendChat} currentUser={userName} />
          </div>
        </div>
      )}

      {/* Menu overlay */}
      <Menu isOpen={menuOpen} onOrder={handleOrder} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
