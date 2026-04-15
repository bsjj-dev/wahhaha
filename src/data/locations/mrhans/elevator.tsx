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
  const [redFlash, setRedFlash] = useState(false);
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

  // Rapid flicker for ceiling lights going out
  useEffect(() => {
    if (phase !== "club") return;
    const interval = setInterval(() => {
      if (Math.random() < 0.45) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 60 + Math.random() * 100);
      }
    }, 800 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [phase]);

  // Red emergency light pulses — independent, slower
  useEffect(() => {
    if (phase !== "club") return;
    const pulse = () => {
      setRedFlash(true);
      setTimeout(() => setRedFlash(false), 300 + Math.random() * 400);
    };
    pulse(); // flash immediately on entering
    const interval = setInterval(() => {
      pulse();
    }, 1500 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [phase]);

  // Glitch messages that appear randomly
  useEffect(() => {
    if (phase !== "club") return;
    const interval = setInterval(() => {
      const msg = GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)];
      setGlitchText(msg);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }, 4000 + Math.random() * 6000);
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
            ? "radial-gradient(ellipse at 50% 30%, #220a0a 0%, #080202 100%)"
            : redFlash
              ? "radial-gradient(ellipse at 50% 20%, #1a0404 0%, #060101 100%)"
              : "radial-gradient(ellipse at 50% 30%, #0d0303 0%, #020101 100%)",
          transition: "background 0.15s",
        }}>

          {/* Red emergency light wash — the main flash effect */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(200,0,0,0.18) 0%, transparent 60%)",
            opacity: redFlash ? 1 : 0,
            transition: "opacity 0.15s",
          }} />
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: "radial-gradient(ellipse at 20% 10%, rgba(200,0,0,0.12) 0%, transparent 40%)",
            opacity: redFlash ? 1 : 0,
            transition: "opacity 0.2s",
          }} />
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: "radial-gradient(ellipse at 80% 10%, rgba(200,0,0,0.12) 0%, transparent 40%)",
            opacity: redFlash ? 1 : 0,
            transition: "opacity 0.2s",
          }} />

          {/* Emergency light fixtures on ceiling */}
          <div className="absolute top-0 left-[18%] flex flex-col items-center z-10">
            <div className="w-8 h-2 rounded-b-sm" style={{
              background: redFlash ? "rgba(255,30,30,0.9)" : "rgba(80,10,10,0.5)",
              boxShadow: redFlash ? "0 0 18px 6px rgba(220,0,0,0.6), 0 0 40px 10px rgba(180,0,0,0.3)" : "none",
              transition: "all 0.15s",
            }} />
          </div>
          <div className="absolute top-0 right-[18%] flex flex-col items-center z-10">
            <div className="w-8 h-2 rounded-b-sm" style={{
              background: redFlash ? "rgba(255,30,30,0.9)" : "rgba(80,10,10,0.5)",
              boxShadow: redFlash ? "0 0 18px 6px rgba(220,0,0,0.6), 0 0 40px 10px rgba(180,0,0,0.3)" : "none",
              transition: "all 0.15s",
            }} />
          </div>

          {/* Remnant disco ball */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-5">
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(180,180,180,0.15) 0%, rgba(100,100,100,0.06) 100%)",
                boxShadow: redFlash
                  ? "0 0 30px rgba(200,50,50,0.3), 0 0 60px rgba(180,0,0,0.15)"
                  : flicker ? "0 0 10px rgba(200,50,50,0.08)" : "none",
                transition: "box-shadow 0.15s",
              }}
            />
            <div className="w-[1px] h-5 bg-white/10 mx-auto -mt-5" />
          </div>

          {/* Scattered light reflections from disco ball */}
          {(flicker || redFlash) && (
            <>
              <div className="absolute top-[15%] left-[20%] w-1.5 h-1.5 rounded-full" style={{ background: redFlash ? "rgba(255,60,60,0.5)" : "rgba(255,255,255,0.15)" }} />
              <div className="absolute top-[25%] right-[30%] w-1 h-1 rounded-full" style={{ background: redFlash ? "rgba(255,60,60,0.4)" : "rgba(255,255,255,0.1)" }} />
              <div className="absolute top-[10%] right-[15%] w-1.5 h-1.5 rounded-full" style={{ background: redFlash ? "rgba(255,60,60,0.5)" : "rgba(255,255,255,0.1)" }} />
              <div className="absolute top-[35%] left-[40%] w-1 h-1 rounded-full" style={{ background: redFlash ? "rgba(255,60,60,0.3)" : "rgba(255,255,255,0.07)" }} />
            </>
          )}

          {/* Dance floor — checkered pattern, more visible */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[45%]"
            style={{
              background: redFlash
                ? "linear-gradient(180deg, #150404 0%, #0a0202 100%)"
                : "linear-gradient(180deg, #080404 0%, #060303 100%)",
              transition: "background 0.15s",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                opacity: redFlash ? 0.12 : 0.05,
                transition: "opacity 0.15s",
                backgroundImage: `
                  linear-gradient(45deg, rgba(200,50,50,0.8) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(200,50,50,0.8) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(200,50,50,0.8) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(200,50,50,0.8) 75%)
                `,
                backgroundSize: "40px 40px",
                backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0",
              }}
            />
          </div>

          {/* Dance poles — rusted, catch red light */}
          <div className="absolute top-[10%] bottom-[45%] left-[20%] w-[3px] z-5" style={{
            background: redFlash
              ? "linear-gradient(180deg, rgba(200,80,60,0.3), rgba(180,60,40,0.15), rgba(200,80,60,0.3))"
              : "linear-gradient(180deg, rgba(150,120,80,0.1), rgba(150,120,80,0.04), rgba(150,120,80,0.1))",
            transition: "background 0.15s",
          }} />
          <div className="absolute top-[10%] bottom-[45%] right-[20%] w-[3px] z-5" style={{
            background: redFlash
              ? "linear-gradient(180deg, rgba(200,80,60,0.3), rgba(180,60,40,0.15), rgba(200,80,60,0.3))"
              : "linear-gradient(180deg, rgba(150,120,80,0.1), rgba(150,120,80,0.04), rgba(150,120,80,0.1))",
            transition: "background 0.15s",
          }} />

          {/* Abandoned bar area */}
          <div className="absolute top-[30%] right-[5%] w-[80px] h-[25%] z-5">
            <div className="absolute inset-0 border border-white/[0.04] rounded-sm bg-black/50" />
            <div className="absolute top-2 left-2 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 rounded-t-sm" style={{
                  height: `${8 + i * 3}px`,
                  background: redFlash ? "rgba(200,60,60,0.08)" : "rgba(255,255,255,0.04)",
                }} />
              ))}
            </div>
          </div>

          {/* Overturned chair silhouettes */}
          <div className="absolute bottom-[46%] left-[35%] w-6 h-4 border border-white/[0.03] -rotate-12 z-5" />
          <div className="absolute bottom-[48%] right-[40%] w-5 h-3 border border-white/[0.03] rotate-[20deg] z-5" />

          {/* Faded "CLUB" text on wall */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-5">
            <div
              className="text-3xl font-bold tracking-[0.5em]"
              style={{
                color: "#ed0606",
                opacity: redFlash ? 0.15 : 0.05,
                transition: "opacity 0.15s",
              }}
            >
              CLUB
            </div>
          </div>

          {/* Glitch message overlay */}
          {showMessage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                className="text-[#ff2020] text-lg font-mono tracking-wider px-6 text-center"
                style={{
                  textShadow: "0 0 20px rgba(237,6,6,0.8), 0 0 40px rgba(237,6,6,0.4)",
                  animation: "glitch 0.3s infinite",
                  opacity: 0.85,
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
