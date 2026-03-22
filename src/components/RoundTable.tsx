"use client";

import Image from "next/image";
import Seat from "./Seat";

export interface Participant {
  id: string;
  name: string;
  videoTrack?: MediaStreamTrack | null;
  audioTrack?: MediaStreamTrack | null;
  isSelf?: boolean;
  orderedFood?: string | null;
}

interface RoundTableProps {
  participants: Participant[];
  menuOpen?: boolean;
  onOpenMenu?: () => void;
}

export default function RoundTable({ participants, menuOpen, onOpenMenu }: RoundTableProps) {
  const totalSeats = Math.max(participants.length, 1);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ====== LAYER 1: BACKGROUND — Real Wah Ha Ha colors ====== */}
      <div className="absolute inset-0">
        {/* Ceiling / dark top */}
        <div
          className="absolute top-0 left-0 right-0 h-[12%]"
          style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)" }}
        />
        {/* Pendant lights */}
        <div className="absolute top-[3%] left-[25%] w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-full" />
        <div className="absolute top-[3%] left-[50%] w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-full" />
        <div className="absolute top-[3%] left-[75%] w-3 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-full" />
        {/* Light glow from pendants */}
        <div className="absolute top-[8%] left-[24%] w-[80px] h-[80px]" style={{ background: "radial-gradient(circle, rgba(255,220,150,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-[8%] left-[49%] w-[80px] h-[80px]" style={{ background: "radial-gradient(circle, rgba(255,220,150,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-[8%] left-[74%] w-[80px] h-[80px]" style={{ background: "radial-gradient(circle, rgba(255,220,150,0.12) 0%, transparent 70%)" }} />

        {/* GREEN upper wall with black trim — the signature Wah Ha Ha look */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "10%",
            height: "28%",
            background: "#4a8c3f",
            borderTop: "6px solid #1a1a1a",
            borderBottom: "4px solid #1a1a1a",
          }}
        >
          {/* Black vertical trim panels */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 border-x border-[#1a1a1a]/40" />
            ))}
          </div>
          {/* Stained glass window accents */}
          <div
            className="absolute top-[15%] left-[8%] w-[60px] h-[50px] rounded-t-full opacity-60"
            style={{ background: "linear-gradient(135deg, #c45a5a, #d4a843, #5a8a4a, #4a6a9a)" }}
          />
          <div
            className="absolute top-[15%] right-[8%] w-[60px] h-[50px] rounded-t-full opacity-60"
            style={{ background: "linear-gradient(135deg, #d4a843, #c45a5a, #4a6a9a, #5a8a4a)" }}
          />
        </div>

        {/* RED / maroon lower wall */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "38%",
            height: "18%",
            background: "linear-gradient(180deg, #8b1a2b 0%, #6b1520 100%)",
            borderBottom: "3px solid #4a1018",
          }}
        />

        {/* Floor — light tile */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            top: "56%",
            background: "linear-gradient(180deg, #c4b49a 0%, #b8a88e 30%, #a89878 100%)",
          }}
        >
          {/* Tile grid lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(0deg, rgba(0,0,0,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      {/* Wall decoration — logo */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-[1]">
        <Image src="/logo.png" alt="Wah Ha Ha" width={120} height={40} className="opacity-40" />
      </div>

      {/* ====== LAYER 2: PEOPLE ====== */}
      <div className="absolute inset-0 z-[5]">
        {participants.map((p, i) => (
          <Seat
            key={p.id}
            participantName={p.name}
            videoTrack={p.videoTrack}
            audioTrack={p.audioTrack}
            isSelf={p.isSelf}
            seatIndex={i}
            totalSeats={totalSeats}
            orderedFood={p.orderedFood}
          />
        ))}
      </div>

      {/* ====== LAYER 3: TABLE FOREGROUND ====== */}
      <div className="absolute bottom-0 left-0 right-0 z-[10] pointer-events-none" style={{ height: "38%" }}>
        {/* Table surface — warm natural wood like the real one */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            background: "radial-gradient(ellipse at 45% 20%, #c49a5a 0%, #a87d3e 25%, #8b6830 50%, #6b4e22 100%)",
            borderTop: "5px solid #d4a843",
            boxShadow: "inset 0 5px 30px rgba(0,0,0,0.2), 0 -6px 30px rgba(0,0,0,0.3)",
          }}
        >
          {/* Wood grain */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              borderRadius: "inherit",
              backgroundImage: `
                repeating-linear-gradient(80deg, transparent, transparent 15px, rgba(180,140,80,0.3) 15px, rgba(180,140,80,0.3) 17px),
                repeating-linear-gradient(85deg, transparent, transparent 30px, rgba(120,80,40,0.15) 30px, rgba(120,80,40,0.15) 32px)
              `,
            }}
          />

          {/* Table edge highlight */}
          <div
            className="absolute top-0 left-[8%] right-[8%] h-[3px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(220,180,100,0.5), transparent)" }}
          />

          {/* Blue Pepsi glasses on table */}
          <div className="absolute top-[20%] left-[12%] right-[12%] flex justify-around">
            {Array.from({ length: Math.min(totalSeats, 8) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {/* Blue glass */}
                <div
                  className="w-5 h-8 rounded-sm opacity-50"
                  style={{
                    background: "linear-gradient(180deg, rgba(100,150,200,0.6) 0%, rgba(80,130,180,0.8) 100%)",
                    border: "1px solid rgba(120,170,220,0.4)",
                    boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Center — lazy susan / condiments area */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30">
            <Image src="/logo-circle.png" alt="" width={40} height={40} className="opacity-50" />
          </div>
        </div>

        {/* Table front edge */}
        <div
          className="absolute bottom-0 left-[3%] right-[3%] h-[12px]"
          style={{
            background: "linear-gradient(180deg, #8b6830 0%, #6b4e22 100%)",
            borderBottom: "2px solid #4a3518",
          }}
        />

        {/* Menu placed in front of you — clickable! */}
        {onOpenMenu && !menuOpen && (
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 cursor-pointer pointer-events-auto z-[15] transition-transform hover:scale-105"
            onClick={onOpenMenu}
            title="Open your menu"
          >
            <div
              className="w-20 h-28 rounded-sm flex flex-col items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(180deg, #8b1a2b 0%, #6b1520 100%)",
                border: "2px solid #d4a843",
                transform: "perspective(200px) rotateX(15deg)",
              }}
            >
              <div className="text-[8px] font-bold text-[#d4a843] tracking-wider">MENU</div>
              <Image src="/logo-circle.png" alt="" width={30} height={30} className="opacity-60 mt-1" />
              <div className="text-[6px] text-[#d4a843]/60 mt-1">Wah Ha Ha</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
