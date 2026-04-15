"use client";

import { useRef, useEffect, useState } from "react";
import SegmentedVideo from "./SegmentedVideo";

interface SeatProps {
  participantName: string;
  videoTrack?: MediaStreamTrack | null;
  audioTrack?: MediaStreamTrack | null;
  isSelf?: boolean;
  seatIndex: number;
  totalSeats: number;
  orderedFood?: string | null;
}

// Returns [leftPercent, topPercent, depthScale] for each seat.
// depthScale (0.85–1.0) only affects apparent depth/perspective;
// actual tile size comes from viewport-aware sizing below.
// topPercent positions the TOP of the person's video element.
function getSeatLayout(total: number): Array<[number, number, number]> {
  if (total === 1) return [[50, 22, 1.0]];
  if (total === 2) return [[35, 22, 0.98], [65, 22, 0.98]];
  if (total === 3) return [[20, 20, 0.95], [50, 24, 0.92], [80, 20, 0.95]];
  if (total === 4) return [[15, 18, 0.94], [38, 24, 0.90], [62, 24, 0.90], [85, 18, 0.94]];
  if (total === 5) return [[8, 16, 0.92], [27, 22, 0.90], [50, 26, 0.88], [73, 22, 0.90], [92, 16, 0.92]];
  if (total === 6) return [[5, 14, 0.92], [22, 20, 0.90], [40, 25, 0.88], [60, 25, 0.88], [78, 20, 0.90], [95, 14, 0.92]];

  // 7-10: distribute evenly across arc
  const seats: Array<[number, number, number]> = [];
  for (let i = 0; i < total; i++) {
    const t = total === 1 ? 0.5 : i / (total - 1);
    const x = 5 + t * 90;
    const arc = Math.sin(t * Math.PI);
    const top = 12 + arc * 18;
    const depth = 0.95 - arc * 0.08; // subtle depth variation
    seats.push([x, top, depth]);
  }
  return seats;
}

// Track viewport dimensions so each seat tile can size itself to fit
// the available room rather than using fixed pixels. This is what lets
// 10 people actually fit on a phone in either orientation.
function useViewportSize() {
  const getSize = () => ({
    w: window.visualViewport?.width ?? window.innerWidth,
    h: window.visualViewport?.height ?? window.innerHeight,
  });

  const [size, setSize] = useState(() =>
    typeof window !== "undefined" ? getSize() : { w: 1024, h: 768 }
  );

  useEffect(() => {
    const update = () => setSize(getSize());
    // visualViewport fires on zoom + scroll offset changes — most reliable on mobile
    window.visualViewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    // orientationchange fires before the viewport has settled; wait for it to finish
    const onOrient = () => setTimeout(update, 200);
    window.addEventListener("orientationchange", onOrient);
    // Also snap on first mount in case initial read was pre-settle
    update();
    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", onOrient);
    };
  }, []);

  return size;
}

const ASPECT = 3 / 4; // video tile width:height

function computeSeatSize(vw: number, vh: number, total: number) {
  // Height budget for the "people zone" between ceiling and table.
  const peopleZoneH = Math.min(Math.max(vh * 0.5, 200), 430);
  const wByHeight = peopleZoneH * ASPECT;

  // Overlap factor scales with crowd size so small groups don't collide.
  // N≤2: slight separation, N≤4: flush, N≤6: mild overlap, N>6: dense packing.
  const overlap =
    total <= 2 ? 0.82
    : total <= 4 ? 0.95
    : total <= 6 ? 1.15
    : 1.35;

  const wByWidth =
    total === 1
      ? Math.min(vw * 0.5, 240)
      : (vw * 0.92 / total) * overlap;

  const w = Math.max(64, Math.min(wByHeight, wByWidth, 260));
  const h = w / ASPECT;
  return { w: Math.round(w), h: Math.round(h) };
}

export default function Seat({
  participantName,
  videoTrack,
  audioTrack,
  isSelf,
  seatIndex,
  totalSeats,
  orderedFood,
}: SeatProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioTrack && audioRef.current && !isSelf) {
      const stream = new MediaStream([audioTrack]);
      audioRef.current.srcObject = stream;
    }
  }, [audioTrack, isSelf]);

  const { w: vw, h: vh } = useViewportSize();
  const layout = getSeatLayout(totalSeats);
  const [leftPct, topPct, depth] = layout[seatIndex] || [50, 18, 1];

  // Viewport-aware base size; `depth` gives a subtle perspective variation.
  const base = computeSeatSize(vw, vh, totalSeats);

  // Clamp height so the tile — and the name tag below it — never disappear
  // under the table. Table is clamped to clamp(160px, 38%, 340px).
  const tableH = Math.max(Math.min(vh * 0.38, 340), 160);
  const tableTopPx = vh - tableH;
  const seatTopPx = (topPct / 100) * vh;
  // 32px = name tag height + breathing room
  const maxH = Math.max(60, tableTopPx - seatTopPx - 32);

  const rawH = Math.round(base.h * depth);
  const videoH = Math.min(rawH, maxH);
  const videoW = Math.round(videoH * ASPECT);

  // z-index: center seats (farther) behind side seats (closer)
  // Lower topPct = closer = higher z-index
  const zIndex = 20 - Math.round(topPct);

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translateX(-50%)",
        zIndex,
      }}
    >
      {/* Segmented video cutout */}
      <div style={{ width: videoW, height: videoH }}>
        {videoTrack ? (
          <SegmentedVideo
            videoTrack={videoTrack}
            width={videoW}
            height={videoH}
            isSelf={isSelf}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "radial-gradient(ellipse at 50% 35%, rgba(60,40,25,0.6) 0%, transparent 65%)",
            }}
          >
            <div className="text-7xl opacity-30 text-[var(--wah-gold)]">
              {participantName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Name tag */}
      <div
        className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
        style={{
          marginTop: -8,
          background: "rgba(0,0,0,0.65)",
          color: "var(--wah-cream)",
          backdropFilter: "blur(4px)",
          fontSize: Math.max(10, Math.min(13, videoW / 18)),
          zIndex: zIndex + 1,
        }}
      >
        {participantName}
        {isSelf && <span className="opacity-40"> (you)</span>}
      </div>

      {orderedFood && (
        <div className="food-serve text-xl mt-1">🍽️</div>
      )}

      {!isSelf && <audio ref={audioRef} autoPlay />}
    </div>
  );
}
