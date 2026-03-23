# Wah Ha Ha — The Back Room

![Wah Ha Ha](public/logo.png)

> *Sunday night dinner at the roundtable, online.*

A virtual gathering space for the Wah Ha Ha crew. Sit around the round table in the back room, see each other through your cameras, order from the real menu, and let Lucas, Som, Nok, and Yu take care of you — just like Sunday nights used to be.

---

## Features

- **Together Mode video** — AI background removal (MediaPipe) composites you into the restaurant scene, sitting behind the table
- **The real Wah Ha Ha menu** — every item scraped from wahhahathaifood.com, organized by category with Thai names, spice levels, and prices
- **Virtual staff** — Lucas, Som, Nok, and Yu. K. Ang take your order, check in on it, and serve it (after a suspiciously long wait)
- **Table Talk chat** — sidebar chat alongside the video
- **Up to 10 people** — WebRTC peer-to-peer, seats arranged around the round table
- **Menu on the table** — click the menu booklet in front of you to order

---

## Stack

- **Next.js 16** + TypeScript + Tailwind CSS
- **MediaPipe Tasks Vision** — real-time selfie segmentation for background removal
- **WebRTC** — peer-to-peer video/audio
- **WebSocket signaling server** — lightweight Node.js relay (`signaling-server.js`)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the signaling server

```bash
npm run signaling
```

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Multiplayer (local network)

To invite friends on the same Wi-Fi, share your machine's local IP:

```bash
ipconfig getifaddr en0
# e.g. 192.168.1.42
```

They go to `http://192.168.1.42:3000`. The signaling server auto-connects using the page's host — no extra config needed.

### iOS / camera over HTTPS

iOS Safari requires HTTPS for camera access. The easiest way:

```bash
npx ngrok http 3000
npx ngrok http 8080
```

Share the `https://` ngrok URL. Update `NEXT_PUBLIC_SIGNALING_URL` in `.env.local` to the ngrok WebSocket URL for the signaling server.

---

## Deploy (Vercel + Render)

### 1. Signaling server → Render

1. Push the repo to GitHub
2. Go to [render.com](https://render.com), create a **New Web Service** from the repo
3. Render auto-detects `render.yaml` — it will deploy `signaling-server.js`
4. Note the URL (e.g. `https://wahhaha-signaling.onrender.com`)

### 2. Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Add the environment variable:
   - `NEXT_PUBLIC_SIGNALING_URL` = `wss://wahhaha-signaling.onrender.com` (your Render URL, with `wss://`)
3. Deploy — Vercel auto-detects Next.js

Both services use HTTPS/WSS, so camera access and WebSocket connections work on all devices including iOS Safari.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SIGNALING_URL` | WebSocket URL of the signaling server. Leave empty for local dev (auto-detects). Set to `wss://your-server.onrender.com` for production. |

---

## Project Structure

```
src/
  app/
    page.tsx              # Main room — WebRTC, ordering, state
    layout.tsx
    globals.css
    api/token/route.ts    # LiveKit token endpoint (optional)
  components/
    Lobby.tsx             # Join screen with camera preview
    RoundTable.tsx        # Scene: walls, table, chair layer
    Seat.tsx              # Per-person seat position + layout
    SegmentedVideo.tsx    # MediaPipe background removal canvas
    Menu.tsx              # Full Wah Ha Ha menu overlay
    Chat.tsx              # Table Talk sidebar
    Toolbar.tsx           # Mic / cam / leave controls
    StaffMessage.tsx      # Toast notifications from staff
  data/
    menu.ts               # Complete Wah Ha Ha menu (real items)
    staff.ts              # Lucas, Som, Nok, Yu. K. Ang
signaling-server.js       # WebSocket relay for WebRTC signaling
```

---

## The Crew

Built for the Sunday night regulars of **Wah Ha Ha Thai Food**
1902 SW 13th St, Gainesville, FL · (352) 363-6327

![](public/logo-circle.png)
