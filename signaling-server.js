import { createServer } from "http";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

// HTTP server — handles plain browser requests and health checks
const server = createServer((req, res) => {
  // Health check for Render
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const totalPeers = [...rooms.values()].reduce((sum, r) => sum + r.size, 0);
  const roomList = [...rooms.entries()]
    .map(([name, peers]) => `  ${name}: ${peers.size} at the table`)
    .join("\n");

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    `Wah Ha Ha Signaling Server\n` +
    `==========================\n` +
    `Status: running\n` +
    `Peers connected: ${totalPeers}\n` +
    (roomList ? `\nRooms:\n${roomList}\n` : `\nNo active rooms.\n`)
  );
});

const wss = new WebSocketServer({ server });

// room -> Map<peerId, { ws, name, isAlive }>
const rooms = new Map();
let nextId = 1;

wss.on("connection", (ws) => {
  let peerId = null;
  let roomName = null;
  ws.isAlive = true;

  ws.on("pong", () => { ws.isAlive = true; });

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (msg.type) {
      case "join": {
        peerId = String(nextId++);
        roomName = msg.room || "sunday-dinner";
        const peerName = msg.name || "Guest";

        if (!rooms.has(roomName)) rooms.set(roomName, new Map());
        const room = rooms.get(roomName);

        // Tell existing peers about the new joiner (they create offers)
        for (const [, existing] of room) {
          safeSend(existing.ws, { type: "peer-joined", peerId, name: peerName });
        }

        // Tell the joiner about existing peers (they wait for offers)
        for (const [existingId, existing] of room) {
          safeSend(ws, { type: "peer-existing", peerId: existingId, name: existing.name });
        }

        room.set(peerId, { ws, name: peerName, isAlive: true });
        console.log(`[${roomName}] ${peerName} joined. ${room.size} at the table.`);
        break;
      }

      case "offer":
      case "answer":
      case "ice-candidate": {
        if (!roomName) return;
        const room = rooms.get(roomName);
        if (!room) return;
        const target = room.get(msg.to);
        const senderName = room.get(peerId)?.name;
        if (target) {
          safeSend(target.ws, { ...msg, from: peerId, name: senderName });
        }
        break;
      }
    }
  });

  ws.on("close", () => {
    if (roomName && peerId) {
      const room = rooms.get(roomName);
      if (room) {
        const name = room.get(peerId)?.name;
        room.delete(peerId);
        console.log(`[${roomName}] ${name} left. ${room.size} at the table.`);

        for (const [, existing] of room) {
          safeSend(existing.ws, { type: "peer-left", peerId });
        }

        if (room.size === 0) rooms.delete(roomName);
      }
    }
  });

  ws.on("error", (err) => {
    console.error(`WebSocket error (peer ${peerId}):`, err.message);
  });
});

// Heartbeat — ping every 30s, drop dead connections
const heartbeat = setInterval(() => {
  for (const [roomName, room] of rooms) {
    for (const [peerId, peer] of room) {
      if (!peer.ws.isAlive) {
        console.log(`[${roomName}] Dropping dead connection: ${peer.name} (${peerId})`);
        peer.ws.terminate();
        room.delete(peerId);
        for (const [, other] of room) {
          safeSend(other.ws, { type: "peer-left", peerId });
        }
        continue;
      }
      peer.ws.isAlive = false;
      peer.ws.ping();
    }
    if (room.size === 0) rooms.delete(roomName);
  }
}, 30000);

wss.on("close", () => clearInterval(heartbeat));

function safeSend(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Wah Ha Ha signaling server running on port ${PORT}`);
});
