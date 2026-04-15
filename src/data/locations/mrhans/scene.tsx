"use client";

import { useState, useEffect } from "react";
import Seat from "@/components/Seat";
import Elevator from "./elevator";
import type { SceneProps } from "../types";

export default function MrHansScene({ participants, menuOpen, onOpenMenu }: SceneProps) {
  const totalSeats = Math.max(participants.length, 1);
  const [elevatorOpen, setElevatorOpen] = useState(false);
  // Flickering floor indicator above the elevator call button
  const [arrowOn, setArrowOn] = useState(true);
  useEffect(() => {
    const tick = () => {
      if (Math.random() < 0.18) {
        setArrowOn(false);
        setTimeout(() => setArrowOn(true), 40 + Math.random() * 120);
      }
    };
    const id = setInterval(tick, 900 + Math.random() * 2200);
    return () => clearInterval(id);
  }, []);

  if (elevatorOpen) {
    return <Elevator onBack={() => setElevatorOpen(false)} />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ====== LAYER 1: BACKGROUND ====== */}
      <div className="absolute inset-0">

        {/* Black ceiling with tile grid — clamped so short landscape viewports don't lose ceiling entirely, and tall viewports don't get an oversized ceiling */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: "clamp(40px, 14%, 110px)", background: "#0a0a0a" }}
        >
          {/* Ceiling tile grid */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          {/* Track lighting rail */}
          <div className="absolute top-[30%] left-[10%] right-[10%] h-[3px] bg-[#1a1a1a]" />
          {/* Track lights */}
          {[20, 40, 60, 80].map((left, i) => (
            <div key={i} className="absolute top-[20%]" style={{ left: `${left}%` }}>
              <div className="w-3 h-4 bg-[#222] rounded-b-sm mx-auto" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60px] h-[60px]" style={{
                background: "radial-gradient(circle, rgba(255,240,200,0.06) 0%, transparent 70%)"
              }} />
            </div>
          ))}
        </div>

        {/* Crystal chandelier — center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-[2]">
          {/* Drop rod */}
          <div className="w-[2px] h-[6%] bg-[#888]/40" style={{ minHeight: "18px" }} />
          {/* Chandelier body */}
          <div className="relative">
            <div className="w-12 h-8 rounded-full" style={{
              background: "radial-gradient(ellipse, rgba(255,245,200,0.6) 0%, rgba(255,220,150,0.3) 50%, transparent 100%)",
              boxShadow: "0 0 25px rgba(255,230,150,0.4), 0 0 60px rgba(255,200,100,0.15)",
            }} />
            {/* Crystal drops */}
            {[-16, -8, 0, 8, 16].map((x, i) => (
              <div key={i} className="absolute bottom-0" style={{ left: `calc(50% + ${x}px)`, transform: "translateX(-50%)" }}>
                <div className="w-[2px] bg-[#ddd]/30" style={{ height: `${6 + Math.abs(x) * 0.3}px` }} />
                <div className="w-1 h-1 rounded-full bg-white/30 mx-auto" />
              </div>
            ))}
          </div>
          {/* Chandelier glow on floor/wall */}
          <div className="absolute top-full w-[200px] h-[200px]" style={{
            background: "radial-gradient(ellipse, rgba(255,230,150,0.08) 0%, transparent 70%)",
            transform: "translateY(-30px)",
          }} />
        </div>

        {/* Cream walls */}
        <div className="absolute left-0 right-0" style={{
          top: "14%",
          height: "42%",
          background: "linear-gradient(180deg, #d4c4a8 0%, #c8b898 100%)",
        }}>
          {/* Dark trim at top */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#1a1208]" />

          {/* Left wall: dark curtain panels */}
          <div className="absolute top-0 bottom-0 left-0 w-[18%]" style={{
            background: "linear-gradient(90deg, #1a1510 0%, #2a1f18 60%, #1e1812 100%)",
          }}>
            {/* Curtain folds */}
            {[20, 45, 70].map((left, i) => (
              <div key={i} className="absolute top-0 bottom-0 w-[1px]" style={{
                left: `${left}%`,
                background: "rgba(0,0,0,0.3)",
              }} />
            ))}
          </div>

          {/* Chinese paintings on cream wall */}
          {[
            { left: "22%", width: "14%", height: "60%", top: "12%" },
            { left: "40%", width: "10%", height: "50%", top: "18%" },
            { left: "62%", width: "14%", height: "58%", top: "14%" },
          ].map((frame, i) => (
            <div key={i} className="absolute" style={{
              left: frame.left, top: frame.top, width: frame.width, height: frame.height,
              border: "2px solid rgba(80,60,40,0.4)",
              background: "rgba(180,160,120,0.15)",
              boxShadow: "1px 1px 4px rgba(0,0,0,0.2)",
            }}>
              {/* Painting content — abstract mountain/bamboo silhouette */}
              <div className="absolute inset-0 opacity-40" style={{
                background: i % 2 === 0
                  ? "linear-gradient(180deg, rgba(120,160,140,0.3) 0%, rgba(80,120,100,0.2) 50%, rgba(60,40,20,0.1) 100%)"
                  : "linear-gradient(180deg, rgba(180,140,80,0.2) 0%, rgba(120,100,60,0.15) 100%)",
              }} />
              {/* Fake brushstroke lines */}
              <div className="absolute bottom-[15%] left-[30%] w-[2px] opacity-20" style={{
                height: "60%", background: "#3a2a1a", transform: `rotate(${i * 3 - 3}deg)`,
              }} />
              <div className="absolute bottom-[15%] left-[50%] w-[1px] opacity-15" style={{
                height: "45%", background: "#3a2a1a",
              }} />
            </div>
          ))}

          {/* Large dark windows — right side, night view outside */}
          <div className="absolute top-0 bottom-0 right-0 w-[20%]" style={{
            background: "linear-gradient(90deg, #0a1520 0%, #0d1a28 100%)",
            borderLeft: "3px solid #1a1208",
          }}>
            {/* Window frames */}
            <div className="absolute top-[5%] bottom-[5%] left-[8%] right-[8%] border border-[rgba(255,255,255,0.06)]">
              {/* Night sky reflection */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(180deg, #050d18 0%, #0a1520 60%, #1a2a1a 100%)",
              }} />
              {/* Outdoor light glow — tree lit from outside */}
              <div className="absolute bottom-[20%] left-[20%] w-[60%] h-[40%]" style={{
                background: "radial-gradient(ellipse, rgba(80,120,80,0.15) 0%, transparent 70%)",
              }} />
              {/* Window divider */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[rgba(255,255,255,0.04)]" />
            </div>
          </div>

          {/* Side table with decorative lamp + vase — left near curtains */}
          <div className="absolute bottom-[5%] left-[14%] flex flex-col items-center">
            {/* Lamp shade */}
            <div className="w-8 h-5 rounded-t-full" style={{
              background: "linear-gradient(180deg, rgba(255,220,150,0.6) 0%, rgba(200,160,100,0.5) 100%)",
              boxShadow: "0 0 12px rgba(255,200,100,0.3)",
            }} />
            {/* Lamp base — vase shape */}
            <div className="w-4 h-6 rounded-b-sm" style={{
              background: "linear-gradient(180deg, #8a6a4a 0%, #6a4a2a 100%)",
            }} />
            {/* Table */}
            <div className="w-10 h-[3px] bg-[#c8b898] rounded-full mt-0.5" />
          </div>

          {/* Red "double happiness" decoration near lamp */}
          <div className="absolute bottom-[8%] left-[16%] text-[#c41818] text-xs font-bold opacity-50"
            style={{ fontFamily: "serif" }}>囍</div>
        </div>

        {/* Dark hardwood floor */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          top: "56%",
          background: "linear-gradient(180deg, #2a1e14 0%, #1e1510 50%, #180f08 100%)",
        }}>
          {/* Wood plank lines */}
          {[15, 30, 45, 60, 75, 90].map((top, i) => (
            <div key={i} className="absolute left-0 right-0 h-[1px]" style={{
              top: `${top}%`,
              background: "rgba(0,0,0,0.25)",
            }} />
          ))}
          {/* Subtle wood grain */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "repeating-linear-gradient(88deg, transparent, transparent 60px, rgba(60,30,10,0.2) 60px, rgba(60,30,10,0.2) 62px)",
          }} />
          {/* Chandelier light pool on floor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[50%]" style={{
            background: "radial-gradient(ellipse, rgba(255,220,150,0.05) 0%, transparent 70%)",
          }} />
        </div>
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

      {/* ====== LAYER 3: TABLE FOREGROUND — white tablecloth ====== */}
      <div className="absolute bottom-0 left-0 right-0 z-[10] pointer-events-none" style={{ height: "clamp(160px, 38%, 340px)" }}>
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            background: "radial-gradient(ellipse at 45% 20%, #f5f2ee 0%, #ece8e2 25%, #e2ddd6 50%, #d5d0c8 100%)",
            borderTop: "4px solid #c9a44a",
            boxShadow: "inset 0 5px 30px rgba(0,0,0,0.08), 0 -6px 30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Linen texture */}
          <div className="absolute inset-0 opacity-5" style={{
            borderRadius: "inherit",
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 3px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 3px)
            `,
          }} />

          {/* Lazy susan / center circle */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-16 h-3 rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #888 0%, transparent 100%)" }} />

          {/* Place settings */}
          <div className="absolute top-[22%] left-[15%] right-[15%] flex justify-around">
            {Array.from({ length: Math.min(totalSeats, 8) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                {/* White plate */}
                <div className="w-5 h-3 rounded-full opacity-50" style={{
                  background: "radial-gradient(ellipse, #fff 0%, #e8e4de 100%)",
                  border: "1px solid rgba(180,160,140,0.3)",
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Table front edge */}
        <div className="absolute bottom-0 left-[3%] right-[3%] h-[10px]" style={{
          background: "linear-gradient(180deg, #d5d0c8 0%, #c8c2ba 100%)",
          borderBottom: "2px solid #b0a898",
        }} />

        {/* Menu — dark leather */}
        {onOpenMenu && !menuOpen && (
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 cursor-pointer pointer-events-auto z-[15] transition-transform hover:scale-105"
            onClick={onOpenMenu}
            title="Open your menu"
          >
            <div
              className="w-20 h-28 rounded-sm flex flex-col items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                border: "2px solid #c9a44a",
                transform: "perspective(200px) rotateX(15deg)",
              }}
            >
              <div className="text-[8px] font-bold text-[#c9a44a] tracking-wider">MENU</div>
              <div className="text-[10px] font-bold text-[#ed0606] mt-2">MR. HAN&apos;S</div>
              <div className="text-[5px] text-[#c9a44a]/40 mt-1">EST. 1975</div>
            </div>
          </div>
        )}
      </div>

      {/* Elevator — gold door on the left wall, away from the window */}
      <button
        className="absolute cursor-pointer group z-[20]"
        style={{
          left: "3%",
          top: "clamp(50px, 15%, 110px)",
          width: "clamp(30px, 5vw, 48px)",
          height: "clamp(52px, 9vw, 82px)",
          background: "linear-gradient(180deg, #b8943a 0%, #c9a44a 18%, #e2c060 42%, #c9a44a 55%, #b08930 80%, #9a7820 100%)",
          border: "2px solid #c9a44a",
          boxShadow: "0 0 12px rgba(201,164,74,0.18), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
          transition: "filter 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.25)")}
        onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
        onClick={() => setElevatorOpen(true)}
        title=""
      >
        {/* Flickering floor indicator */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2" style={{ width: "clamp(22px, 4vw, 36px)" }}>
          <div style={{
            background: "#080604",
            border: "1px solid rgba(201,164,74,0.5)",
            borderRadius: "2px",
            padding: "1px 0",
            color: arrowOn ? "#c9a44a" : "#1a1200",
            fontSize: "clamp(8px, 1.4vw, 12px)",
            fontFamily: "monospace",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: arrowOn ? "0 0 6px rgba(201,164,74,0.9)" : "none",
            transition: "color 0.04s, text-shadow 0.04s",
          }}>▲</div>
        </div>
        {/* Two-panel door seam */}
        <div className="absolute top-[4%] bottom-[4%] left-1/2 w-[1px]" style={{ background: "rgba(0,0,0,0.45)" }} />
        {/* Horizontal panel rails */}
        <div className="absolute left-0 right-0" style={{ top: "33%", height: "1px", background: "rgba(0,0,0,0.3)" }} />
        <div className="absolute left-0 right-0" style={{ top: "66%", height: "1px", background: "rgba(0,0,0,0.3)" }} />
        {/* Subtle gold sheen on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,230,150,0.15) 0%, transparent 70%)",
        }} />
      </button>
    </div>
  );
}
