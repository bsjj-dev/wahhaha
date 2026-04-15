"use client";

import { useState, useCallback, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Lobby from "@/components/Lobby";
import Chat, { type ChatMessage } from "@/components/Chat";
import Menu from "@/components/Menu";
import Toolbar from "@/components/Toolbar";
import StaffMessage from "@/components/StaffMessage";
import { getLocation } from "@/data/locations";
import { menu as wahhahaMenu, categories as wahhahaCategories } from "@/data/locations/wahhaha/menu";
import { staff as wahhahaStaff, getRandomStaff as wahhahaRandomStaff, getRandomResponse as wahhahaRandomResponse } from "@/data/locations/wahhaha/staff";
import { menu as mrhansMenu, categories as mrhansCategories } from "@/data/locations/mrhans/menu";
import { staff as mrhansStaff, getRandomStaff as mrhansRandomStaff, getRandomResponse as mrhansRandomResponse } from "@/data/locations/mrhans/staff";
import type { MenuItem, StaffMember } from "@/data/locations/types";

interface Participant {
  id: string;
  name: string;
  videoTrack?: MediaStreamTrack | null;
  audioTrack?: MediaStreamTrack | null;
  isSelf?: boolean;
  orderedFood?: string | null;
}

interface StaffNotification {
  id: string;
  staffName: string;
  staffAvatar: string;
  message: string;
}

// Location data lookup
function getLocationData(locationId: string) {
  if (locationId === "mrhans") {
    return {
      menu: mrhansMenu,
      categories: mrhansCategories,
      staff: mrhansStaff,
      getRandomStaff: mrhansRandomStaff,
      getRandomResponse: mrhansRandomResponse,
    };
  }
  // Default: wahhaha
  return {
    menu: wahhahaMenu,
    categories: wahhahaCategories,
    staff: wahhahaStaff,
    getRandomStaff: wahhahaRandomStaff,
    getRandomResponse: wahhahaRandomResponse,
  };
}

export default function LocationRoom({ params }: { params: Promise<{ location: string }> }) {
  const { location: locationId } = use(params);
  const router = useRouter();
  const locationConfig = getLocation(locationId);
  const locationData = getLocationData(locationId);
  const Scene = locationConfig.Scene;
  const Intro = locationConfig.Intro;

  const [introDone, setIntroDone] = useState(!Intro);

  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  // Media state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Data channel for peer-to-peer messaging
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannels = useRef<Map<string, RTCDataChannel>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);

  // Apply location theme
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(locationConfig.theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    document.body.style.background = locationConfig.theme.bodyBackground;
    document.body.style.color = locationConfig.theme.textColor;
    document.title = `${locationConfig.name} - ${locationConfig.subtitle}`;
  }, [locationConfig]);

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

      connectSignaling(name, room, stream);
    } catch {
      const selfParticipant: Participant = {
        id: "self",
        name: name,
        isSelf: true,
      };
      setParticipants([selfParticipant]);
      setJoined(true);

      connectSignaling(name, room, null);
    }

    // Greet from first staff member
    const greeter = locationData.staff[0];
    setTimeout(() => {
      addStaffNotification(greeter.name, greeter.avatar, greeter.greeting);
      addStaffChat(greeter.name, greeter.greeting);
    }, 1500);
  }, [locationData.staff]);

  // WebSocket signaling for peer connections
  const connectSignaling = useCallback((name: string, room: string, stream: MediaStream | null) => {
    const signalingHost = process.env.NEXT_PUBLIC_SIGNALING_URL
      || `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.hostname}:8080`;

    const ws = new WebSocket(signalingHost);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[signal] WS connected, joining room:", room);
      ws.send(JSON.stringify({ type: "join", room, name }));
    };

    ws.onerror = (e) => console.error("[signal] WS error:", e);
    ws.onclose = (e) => console.log("[signal] WS closed:", e.code, e.reason);

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      console.log("[signal] received:", msg.type, msg.peerId || msg.from || "");

      switch (msg.type) {
        case "peer-joined": {
          const pc = createPeerConnection(msg.peerId, msg.name, stream, ws);
          peerConnections.current.set(msg.peerId, pc);

          const dc = pc.createDataChannel("chat");
          setupDataChannel(dc, msg.peerId);
          dataChannels.current.set(msg.peerId, dc);

          setParticipants((prev) => {
            if (prev.find((p) => p.id === msg.peerId)) return prev;
            return [...prev, { id: msg.peerId, name: msg.name }];
          });

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({
            type: "offer",
            to: msg.peerId,
            offer: pc.localDescription,
          }));
          break;
        }
        case "peer-existing": {
          const pc = createPeerConnection(msg.peerId, msg.name, stream, ws);
          peerConnections.current.set(msg.peerId, pc);

          pc.ondatachannel = (e) => {
            setupDataChannel(e.channel, msg.peerId);
            dataChannels.current.set(msg.peerId, e.channel);
          };

          setParticipants((prev) => {
            if (prev.find((p) => p.id === msg.peerId)) return prev;
            return [...prev, { id: msg.peerId, name: msg.name }];
          });
          break;
        }
        case "offer": {
          const pc = peerConnections.current.get(msg.from)
            ?? (() => {
                const newPc = createPeerConnection(msg.from, msg.name, stream, ws);
                peerConnections.current.set(msg.from, newPc);
                newPc.ondatachannel = (e) => {
                  setupDataChannel(e.channel, msg.from);
                  dataChannels.current.set(msg.from, e.channel);
                };
                return newPc;
              })();

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
    const iceServers: RTCIceServer[] = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ];
    if (process.env.NEXT_PUBLIC_TURN_URL) {
      iceServers.push({
        urls: process.env.NEXT_PUBLIC_TURN_URL,
        username: process.env.NEXT_PUBLIC_TURN_USERNAME || "",
        credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL || "",
      });
    }
    const pc = new RTCPeerConnection({ iceServers, iceCandidatePoolSize: 10 });

    console.log("[rtc] creating PC for", peerId, peerName, "tracks:", localStream?.getTracks().length ?? 0);

    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    pc.onconnectionstatechange = () => console.log("[rtc]", peerId, "connection:", pc.connectionState);
    pc.oniceconnectionstatechange = () => console.log("[rtc]", peerId, "ice:", pc.iceConnectionState);

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
        const s = locationData.getRandomStaff();
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

  const dismissNotification = useCallback((id: string) => {
    setStaffNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Order food
  const handleOrder = useCallback(
    (item: MenuItem) => {
      const s = locationData.getRandomStaff();
      const response = locationData.getRandomResponse(s.orderResponses);

      addStaffNotification(s.name, s.avatar, response);
      addStaffChat(s.name, `${userName} ordered ${item.name} — ${response}`);

      broadcast({ type: "order", sender: userName, itemName: item.name });

      const deliveryTime = 30000 + Math.random() * 90000;

      setTimeout(() => {
        const waitStaff = locationData.getRandomStaff();
        const waitLine = locationData.getRandomResponse(waitStaff.waitingLines);
        addStaffNotification(waitStaff.name, waitStaff.avatar, waitLine);
        addStaffChat(waitStaff.name, waitLine);
      }, deliveryTime * 0.4 + Math.random() * 5000);

      if (deliveryTime > 60000) {
        setTimeout(() => {
          const waitStaff = locationData.getRandomStaff();
          const waitLine = locationData.getRandomResponse(waitStaff.waitingLines);
          addStaffChat(waitStaff.name, waitLine);
        }, deliveryTime * 0.7 + Math.random() * 5000);
      }

      setTimeout(() => {
        const servingStaff = locationData.getRandomStaff();
        const servingLine = locationData.getRandomResponse(servingStaff.servingLines);
        addStaffNotification(servingStaff.name, servingStaff.avatar, servingLine);
        addStaffChat(servingStaff.name, `Serving ${item.name} to ${userName} — ${servingLine}`);

        setParticipants((prev) =>
          prev.map((p) => (p.id === "self" ? { ...p, orderedFood: item.name } : p)),
        );
      }, deliveryTime);
    },
    [userName, broadcast, locationData],
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
    router.push("/");
  }, [localStream, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, [localStream]);

  if (Intro && !introDone) {
    return <Intro onEnter={() => setIntroDone(true)} />;
  }

  if (!joined) {
    return (
      <Lobby
        onJoin={joinRoom}
        locationName={locationConfig.name}
        locationSubtitle={locationConfig.subtitle}
        locationDescription={locationConfig.description}
        locationLogo={locationConfig.logo}
        locationAddress={locationConfig.address}
        accentColor={locationConfig.theme.colors["--loc-primary"] || "var(--wah-gold)"}
      />
    );
  }

  return (
    <div
      className="flex relative overflow-hidden"
      style={{
        height: "100dvh",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Main area - table */}
      <div className="flex-1 relative">
        {/* Room header */}
        <div className="absolute left-4 z-10" style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}>
          <div className="text-xs font-semibold" style={{ color: locationConfig.theme.colors["--loc-primary"], opacity: 0.6 }}>
            {locationConfig.subtitle.toUpperCase()}
          </div>
          <div className="text-[10px] opacity-30">
            Room: {roomCode} &bull; {participants.length}/10 seated
          </div>
        </div>

        {/* Scene with participants */}
        <div className="absolute inset-0 z-0">
          <Scene
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

      {/* Chat sidebar — shown only when viewport is both wide AND tall enough
          (iPad+ in any orientation). Phone landscape is wide but short, so it
          falls through to the FAB + drawer below. */}
      <div className="chat-sidebar shrink-0 w-72 xl:w-80">
        <Chat messages={chatMessages} onSend={handleSendChat} currentUser={userName} />
      </div>

      {/* Floating chat toggle — phones + short-landscape phones */}
      <button
        className="chat-fab absolute z-30 w-11 h-11 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-xl active:scale-95 transition-transform"
        style={{
          right: "max(1rem, env(safe-area-inset-right))",
          bottom: "calc(4.5rem + env(safe-area-inset-bottom))",
        }}
        onClick={() => setChatOpen((o) => !o)}
        aria-label="Toggle chat"
      >
        💬
        {chatMessages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] flex items-center justify-center text-white font-bold" style={{ background: locationConfig.theme.colors["--loc-accent"] || "var(--wah-red)" }}>
            {chatMessages.length > 9 ? "9+" : chatMessages.length}
          </span>
        )}
      </button>

      {/* Mobile chat drawer — portrait: bottom sheet; landscape: right sheet */}
      {chatOpen && (
        <div className="chat-drawer absolute inset-0 z-40 flex portrait:flex-col landscape:flex-row">
          <div className="flex-1 bg-black/40" onClick={() => setChatOpen(false)} />
          <div className="bg-[#1a1a1a] portrait:h-[65%] portrait:w-full landscape:w-[380px] landscape:max-w-[60vw] landscape:h-full">
            <Chat messages={chatMessages} onSend={handleSendChat} currentUser={userName} />
          </div>
        </div>
      )}

      {/* Menu overlay */}
      <Menu
        isOpen={menuOpen}
        onOrder={handleOrder}
        onClose={() => setMenuOpen(false)}
        items={locationData.menu}
        categories={locationData.categories}
        locationName={locationConfig.name}
        locationAddress={locationConfig.address}
        locationPhone={locationConfig.phone}
        locationLogo={locationConfig.logo}
        accentColor={locationConfig.theme.colors["--loc-accent"] || "var(--wah-red)"}
      />
    </div>
  );
}
