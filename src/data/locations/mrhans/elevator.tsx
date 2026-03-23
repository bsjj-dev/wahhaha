"use client";

import { useState, useEffect, useCallback } from "react";

type Phase = "doors" | "descending" | "arrived" | "club";

const GLITCH_MESSAGES = [
  "...you shouldn't be down here...",
  "...the music stopped in 1992...",
  "...they sealed it for a reason...",
  "...can you hear them dancing?...",
  "...the flowers were a warning...",
  "...Mr. Han knew...",
  "...lower level access REVOKED...",
  "...do not disturb the guests...",
];

export default function Elevator({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("doors");
  const [flicker, setFlicker] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Elevator sequence
  useEffect(() => {
    if (phase === "doors") {
      const t = setTimeout(() => setPhase("descending"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "descending") {
      const t = setTimeout(() => setPhase("arrived"), 4000);
      return () => clearTimeout(t);
    }
    if (phase === "arrived") {
      const t = setTimeout(() => setPhase("club"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Random flicker effect in the club
  useEffect(() => {
    if (phase !== "club") return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 80 + Math.random() * 120);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [phase]);

  // Glitch messages that appear randomly
  useEffect(() => {
    if (phase !== "club") return;
    const interval = setInterval(() => {
      const msg = GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)];
      setGlitchText(msg);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
    }, 5000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Phase: Elevator doors closing */}
      {phase === "doors" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Left door */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#1a1515] border-r border-[rgba(80,60,40,0.3)] transition-all duration-[2000ms] ease-in-out"
            style={{ width: "50%" }}
          />
          {/* Right door */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-[#1a1515] border-l border-[rgba(80,60,40,0.3)] transition-all duration-[2000ms] ease-in-out"
            style={{ width: "50%" }}
          />
          {/* Center seam */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-[rgba(60,40,30,0.4)] z-10" />
          {/* Floor indicator */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <div className="text-[#c9a44a]/60 text-xs font-mono tracking-widest">
              FLOOR 1
            </div>
          </div>
        </div>
      )}

      {/* Phase: Descending */}
      {phase === "descending" && (
        <div className="absolute inset-0 bg-[#0a0808] flex flex-col items-center justify-center">
          {/* Elevator interior */}
          <div className="absolute inset-[5%] border border-[rgba(80,60,40,0.15)] bg-[#0d0a0a]">
            {/* Mirrored walls — subtle reflections */}
            <div className="absolute inset-0 opacity-5" style={{
              background: "linear-gradient(135deg, rgba(200,200,200,0.1) 0%, transparent 50%, rgba(200,200,200,0.05) 100%)"
            }} />

            {/* Floor indicator changing */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <div className="text-[#c9a44a]/80 text-sm font-mono tracking-widest animate-pulse">
                B1
              </div>
              <div className="w-8 h-[1px] bg-[#c9a44a]/20 mx-auto mt-1" />
            </div>

            {/* Descending arrow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[#ed0606]/40 text-lg animate-bounce">
              ▼
            </div>

            {/* Rumbling/shaking effect via CSS */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <div className="text-[10px] text-white/10 font-mono animate-pulse">
                ...descending...
              </div>
            </div>
          </div>

          {/* Subtle mechanical sounds represented visually */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-[2px] bg-[#ed0606]/10 animate-pulse"
                style={{
                  height: `${4 + Math.random() * 12}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Phase: Arrived — doors opening to darkness */}
      {phase === "arrived" && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {/* Left door opening */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#1a1515] border-r border-[rgba(80,60,40,0.3)] transition-all duration-[2000ms] ease-in-out"
            style={{ width: "0%" }}
          />
          {/* Right door opening */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-[#1a1515] border-l border-[rgba(80,60,40,0.3)] transition-all duration-[2000ms] ease-in-out"
            style={{ width: "0%" }}
          />
          {/* Floor indicator */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <div className="text-[#ed0606]/60 text-xs font-mono tracking-widest">
              LOWER LEVEL
            </div>
          </div>
        </div>
      )}

      {/* Phase: The abandoned club */}
      {phase === "club" && (
        <div className="absolute inset-0" style={{
          background: flicker
            ? "radial-gradient(ellipse at 50% 30%, #1a0808 0%, #050202 100%)"
            : "radial-gradient(ellipse at 50% 30%, #0d0505 0%, #020101 100%)",
          transition: "background 0.1s",
        }}>
          {/* Remnant disco ball — barely catches light */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2">
            <div
              className="w-6 h-6 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(180,180,180,0.08) 0%, rgba(100,100,100,0.03) 100%)",
                boxShadow: flicker ? "0 0 20px rgba(200,50,50,0.05)" : "none",
              }}
            />
            <div className="w-[1px] h-4 bg-white/5 mx-auto -mt-4" />
          </div>

          {/* Scattered light reflections from disco ball when flickering */}
          {flicker && (
            <>
              <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-white/10" />
              <div className="absolute top-[25%] right-[30%] w-1 h-1 rounded-full bg-white/5" />
              <div className="absolute top-[10%] right-[15%] w-1 h-1 rounded-full bg-[#ed0606]/5" />
            </>
          )}

          {/* Dance floor — faded checkered pattern */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[45%]"
            style={{
              background: "linear-gradient(180deg, #080404 0%, #060303 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, rgba(200,50,50,0.5) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(200,50,50,0.5) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(200,50,50,0.5) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(200,50,50,0.5) 75%)
                `,
                backgroundSize: "40px 40px",
                backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0",
              }}
            />
          </div>

          {/* Dance poles — matching the ones upstairs, but rusted */}
          <div className="absolute top-[10%] bottom-[45%] left-[20%] w-[3px]" style={{
            background: "linear-gradient(180deg, rgba(150,120,80,0.08), rgba(150,120,80,0.03), rgba(150,120,80,0.08))"
          }} />
          <div className="absolute top-[10%] bottom-[45%] right-[20%] w-[3px]" style={{
            background: "linear-gradient(180deg, rgba(150,120,80,0.08), rgba(150,120,80,0.03), rgba(150,120,80,0.08))"
          }} />

          {/* Abandoned bar area — right side */}
          <div className="absolute top-[30%] right-[5%] w-[80px] h-[25%]">
            <div className="absolute inset-0 border border-white/[0.03] rounded-sm bg-black/50" />
            {/* Empty bottles silhouette */}
            <div className="absolute top-2 left-2 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 rounded-t-sm bg-white/[0.03]" style={{ height: `${8 + i * 3}px` }} />
              ))}
            </div>
          </div>

          {/* Overturned chair silhouettes */}
          <div className="absolute bottom-[46%] left-[35%] w-6 h-4 border border-white/[0.02] -rotate-12" />
          <div className="absolute bottom-[48%] right-[40%] w-5 h-3 border border-white/[0.02] rotate-[20deg]" />

          {/* Faded "CLUB" text on wall — barely visible */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2">
            <div
              className="text-2xl font-bold tracking-[0.5em] opacity-[0.04]"
              style={{ color: "#ed0606" }}
            >
              CLUB
            </div>
          </div>

          {/* Mysterious residual energy — faint red pulse near edges */}
          <div className="absolute top-[40%] left-0 w-[30%] h-[2px]" style={{
            background: "linear-gradient(90deg, rgba(200,50,50,0.06), transparent)",
            opacity: flicker ? 0.8 : 0.2,
            transition: "opacity 0.3s",
          }} />
          <div className="absolute top-[60%] right-0 w-[20%] h-[2px]" style={{
            background: "linear-gradient(-90deg, rgba(200,50,50,0.06), transparent)",
            opacity: flicker ? 0.8 : 0.2,
            transition: "opacity 0.3s",
          }} />

          {/* Glitch message overlay */}
          {showMessage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                className="text-[#ed0606]/30 text-xs font-mono tracking-wider px-4 text-center"
                style={{
                  textShadow: "0 0 10px rgba(237,6,6,0.2)",
                  animation: "glitch 0.3s infinite",
                }}
              >
                {glitchText}
              </div>
            </div>
          )}

          {/* Back button — elevator call button */}
          <button
            onClick={handleBack}
            className="absolute top-4 right-4 z-30 group cursor-pointer"
            title="Return upstairs"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded bg-black/60 border border-white/[0.06] hover:border-[#c9a44a]/20 transition-colors">
              <div className="text-[#c9a44a]/40 text-lg group-hover:text-[#c9a44a]/70 transition-colors">▲</div>
              <div className="text-[10px] text-white/20 font-mono group-hover:text-white/40 transition-colors">CALL ELEVATOR</div>
            </div>
          </button>

        </div>
      )}
    </div>
  );
}
