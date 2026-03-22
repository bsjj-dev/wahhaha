"use client";

import { useRef, useEffect } from "react";
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

// Returns [leftPercent, topPercent, scale] for each seat.
// The table foreground covers the bottom ~38% of the screen.
// People are positioned so their lower body overlaps into the table zone,
// making it look like they're sitting behind the table.
// topPercent positions the TOP of the person's video element.
function getSeatLayout(total: number): Array<[number, number, number]> {
  // For 1 person: centered, large
  if (total === 1) return [[50, 22, 1.0]];
  if (total === 2) return [[35, 22, 0.95], [65, 22, 0.95]];
  if (total === 3) return [[20, 20, 0.88], [50, 24, 0.85], [80, 20, 0.88]];
  if (total === 4) return [[15, 18, 0.84], [38, 24, 0.80], [62, 24, 0.80], [85, 18, 0.84]];
  if (total === 5) return [[8, 16, 0.78], [27, 22, 0.76], [50, 26, 0.73], [73, 22, 0.76], [92, 16, 0.78]];
  if (total === 6) return [[5, 14, 0.75], [22, 20, 0.73], [40, 25, 0.70], [60, 25, 0.70], [78, 20, 0.73], [95, 14, 0.75]];

  // 7-10: distribute evenly across arc
  const seats: Array<[number, number, number]> = [];
  for (let i = 0; i < total; i++) {
    const t = total === 1 ? 0.5 : i / (total - 1);
    const x = 5 + t * 90;
    const arc = Math.sin(t * Math.PI);
    const top = 12 + arc * 18;
    const scale = 0.75 - arc * 0.12;
    seats.push([x, top, scale]);
  }
  return seats;
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

  const layout = getSeatLayout(totalSeats);
  const [leftPct, topPct, scale] = layout[seatIndex] || [50, 18, 1];

  // Video dimensions — tall enough to show head + torso
  const videoW = Math.round(240 * scale);
  const videoH = Math.round(320 * scale);

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
          fontSize: Math.max(10, 12 * scale),
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
