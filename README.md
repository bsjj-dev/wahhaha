# Wah Ha Ha — Virtual Dining

> *Sunday night dinner, online.*

A virtual gathering space for the crew. Choose your restaurant, sit around the table, see each other through your cameras, and order from the real menu — staff included.

---

## Locations

- **Wah Ha Ha Thai Food** — The roundtable. Lucas, Som, Nok, and Yu. K. Ang take your order.
- **Mr. Han's Supper Club** — Fine dining since 1975. Alexander, Sherry, and David. Place your hand on the plaque to enter. (Find the elevator.)

---

## Features

- **Together Mode video** — AI background removal (MediaPipe) composites you into the scene
- **Real menus** — every item from both restaurants, organized by category with prices and spice levels
- **Virtual staff** — take your order, check in, and serve it — with full personality
- **Table Talk chat** — sidebar on tablet/desktop, drawer on mobile
- **Up to 10 people** — WebRTC peer-to-peer, viewport-aware layout that actually fits on a phone
- **Passphrase auth** — simple shared passphrase gate for the friend group
- **Wall art** — real paintings on the Mr. Han's dining room walls
- **Secrets** — look around

---

## Stack

- **Next.js** + TypeScript + Tailwind CSS
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

No `AUTH_PASSPHRASE` set = open access (dev mode).

---

## Deploy (Vercel + Render)

### 1. Signaling server → Render

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → select repo
3. Render auto-detects `render.yaml` and deploys `signaling-server.js`
4. Note the service URL (e.g. `https://wahhaha-signaling.onrender.com`)

### 2. Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Add environment variables:
   - `NEXT_PUBLIC_SIGNALING_URL` = `wss://wahhaha-signaling.onrender.com`
   - `AUTH_PASSPHRASE` = your shared passphrase
3. Deploy — Vercel auto-detects Next.js

Both services use HTTPS/WSS, so camera access works on all devices including iOS Safari.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SIGNALING_URL` | WebSocket URL of the signaling server. Leave empty for local dev (auto-detects). Set to `wss://your-server.onrender.com` for production. |
| `AUTH_PASSPHRASE` | Shared passphrase for the friend group. Leave unset for open access in dev. |
| `NEXT_PUBLIC_TURN_URL` | Optional TURN server URL for NAT traversal. |
| `NEXT_PUBLIC_TURN_USERNAME` | Optional TURN server username. |
| `NEXT_PUBLIC_TURN_CREDENTIAL` | Optional TURN server credential. |

---

## Project Structure

```
src/
  app/
    page.tsx                    # Location picker
    [location]/page.tsx         # Room — WebRTC, ordering, state
    login/page.tsx              # Passphrase auth
    api/auth/route.ts           # Auth API (validates passphrase, sets cookie)
    layout.tsx
    globals.css
  components/
    Lobby.tsx                   # Join screen with camera preview
    Seat.tsx                    # Per-person seat position + layout
    SegmentedVideo.tsx          # MediaPipe background removal canvas
    Menu.tsx                    # Full menu overlay
    Chat.tsx                    # Table Talk sidebar
    Toolbar.tsx                 # Mic / cam / leave controls
    StaffMessage.tsx            # Toast notifications from staff
  data/
    locations/
      index.ts                  # Location registry
      types.ts                  # LocationConfig, SceneProps interfaces
      wahhaha/                  # Wah Ha Ha location
        config.ts
        scene.tsx
        menu.ts
        staff.ts
      mrhans/                   # Mr. Han's Supper Club
        config.ts
        scene.tsx
        plaque.tsx              # Intro screen
        elevator.tsx            # Easter egg
        menu.ts
        staff.ts
  middleware.ts                 # Auth middleware (protects all routes)
signaling-server.js             # WebSocket relay for WebRTC signaling
render.yaml                     # Render deployment blueprint
```

---

## Adding a Location

1. Create `src/data/locations/<slug>/` with `config.ts`, `scene.tsx`, `menu.ts`, `staff.ts`
2. Implement `LocationConfig` from `../types`
3. Register it in `src/data/locations/index.ts`

---

## Dedications

To the regular Gator boys of **Wah Ha Ha Thai Food**

And for the occasional fine dining at **Mr. Han's Supper Club**

---

Special shoutout to **Yu** — the real host of the table, the reason any of this exists, and the standard every virtual staff member is trying to live up to. 🙏
