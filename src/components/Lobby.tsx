"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface LobbyProps {
  onJoin: (name: string, roomCode: string) => void;
  locationName?: string;
  locationSubtitle?: string;
  locationDescription?: string;
  locationLogo?: string;
  locationAddress?: string;
  accentColor?: string;
}

export default function Lobby({
  onJoin,
  locationName = "Wah Ha Ha",
  locationSubtitle = "The Back Room",
  locationDescription = "The back room is ready. Your table awaits.",
  locationLogo = "/logo.png",
  locationAddress = "Thai Cuisine \u2022 Gainesville, FL",
  accentColor = "var(--wah-gold)",
}: LobbyProps) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // navigator.mediaDevices is undefined on iOS over plain HTTP (requires HTTPS)
    if (!navigator.mediaDevices?.getUserMedia) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setPreviewStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        // Camera not available or denied — still allow joining
      });

    return () => {
      previewStream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    previewStream?.getTracks().forEach((t) => t.stop());
    onJoin(name.trim(), roomCode.trim() || "sunday-dinner");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Image
            src={locationLogo}
            alt={locationName}
            width={120}
            height={120}
            className="mx-auto mb-3 object-contain max-h-24"
          />
          <p className="text-white/50 text-sm">{locationAddress}</p>
          <div className="mt-4 text-white/30 text-xs italic">
            &ldquo;{locationDescription}&rdquo;
          </div>
        </div>

        {/* Camera preview */}
        <div className="mb-6 flex justify-center">
          <div className="seat-video w-32 h-32">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </div>
        </div>

        {/* Join form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5 font-semibold" style={{ color: accentColor }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-[var(--wah-wood)]/40 border border-[var(--wah-wood)] rounded-lg px-4 py-3 text-[var(--wah-cream)] placeholder:text-[var(--wah-cream)]/30 focus:outline-none focus:border-[var(--wah-gold)]/50 text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5 font-semibold" style={{ color: accentColor }}>
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="sunday-dinner (default)"
              className="w-full bg-[var(--wah-wood)]/40 border border-[var(--wah-wood)] rounded-lg px-4 py-3 text-[var(--wah-cream)] placeholder:text-[var(--wah-cream)]/30 focus:outline-none focus:border-[var(--wah-gold)]/50 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-[var(--wah-red)] hover:bg-[var(--wah-red)]/80 disabled:opacity-40 text-[var(--wah-gold)] font-bold py-3 rounded-lg transition-colors text-sm"
          >
            Take a Seat
          </button>
        </form>

        <p className="text-center text-[var(--wah-cream)]/20 text-xs mt-6">
          Up to 10 friends around the roundtable
        </p>
      </div>
    </div>
  );
}
