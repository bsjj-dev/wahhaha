"use client";

import { useState } from "react";

export default function PlaqueIntro({ onEnter }: { onEnter: () => void }) {
  const [touched, setTouched] = useState(false);
  const [entering, setEntering] = useState(false);

  const handleTouch = () => {
    if (touched) return;
    setTouched(true);
    setTimeout(() => {
      setEntering(true);
      setTimeout(onEnter, 1200);
    }, 1800);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(180deg, #c8b89a 0%, #b8a88a 100%)" }}
    >
      {/* Fade-to-black overlay when entering */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-1000"
        style={{ opacity: entering ? 1 : 0 }}
      />

      <div className="flex flex-col items-center gap-10 px-8">
        {/* The bronze plaque */}
        <div
          className="relative cursor-pointer select-none"
          onClick={handleTouch}
          onTouchStart={handleTouch}
        >
          {/* Plaque body */}
          <div
            className="relative px-10 py-8 rounded-sm"
            style={{
              background: touched
                ? "linear-gradient(135deg, #8a9a7a 0%, #6a7a5a 30%, #8a9a7a 60%, #7a8a6a 100%)"
                : "linear-gradient(135deg, #8a8a7a 0%, #6a6a5a 30%, #8a8a7a 60%, #7a7a6a 100%)",
              boxShadow: touched
                ? "4px 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px rgba(180,200,140,0.3)"
                : "4px 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              border: "3px solid #5a5a4a",
              transition: "all 0.3s ease",
              minWidth: "280px",
            }}
          >
            {/* Inner border */}
            <div
              className="absolute inset-3 pointer-events-none"
              style={{ border: "1px solid rgba(100,100,80,0.4)" }}
            />

            {/* Plaque text */}
            <div className="relative text-center space-y-3">
              <div
                className="text-3xl font-bold tracking-widest leading-tight"
                style={{
                  color: touched ? "#c8d8b0" : "#3a3a2a",
                  textShadow: touched
                    ? "0 0 20px rgba(180,220,120,0.5), 1px 1px 0 rgba(0,0,0,0.3)"
                    : "1px 1px 0 rgba(180,170,140,0.3), -1px -1px 0 rgba(0,0,0,0.2)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  transition: "all 0.5s ease",
                }}
              >
                MR. HAN
              </div>
              <div
                className="text-xl font-semibold tracking-[0.25em]"
                style={{
                  color: touched ? "#b0c898" : "#3a3a2a",
                  textShadow: touched
                    ? "0 0 15px rgba(180,220,120,0.4)"
                    : "1px 1px 0 rgba(180,170,140,0.3), -1px -1px 0 rgba(0,0,0,0.2)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  transition: "all 0.5s ease",
                }}
              >
                SUPPER CLUB
              </div>
              <div
                className="w-[60%] mx-auto h-px mt-2"
                style={{ background: touched ? "rgba(180,220,120,0.3)" : "rgba(60,60,40,0.3)" }}
              />
              <div
                className="text-xs tracking-[0.2em] pt-1"
                style={{
                  color: touched ? "#a0b888" : "#4a4a3a",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  transition: "all 0.5s ease",
                }}
              >
                PROPER ATTIRE
              </div>
              <div
                className="text-xs tracking-[0.2em]"
                style={{
                  color: touched ? "#a0b888" : "#4a4a3a",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  transition: "all 0.5s ease",
                }}
              >
                ESSENTIAL
              </div>
            </div>

            {/* Handprint glow when touched */}
            {touched && (
              <div
                className="absolute inset-0 rounded-sm pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 50% 50%, rgba(180,220,120,0.15) 0%, transparent 70%)",
                  animation: "pulse 1s ease-in-out",
                }}
              />
            )}
          </div>

          {/* Shadow beneath plaque */}
          <div
            className="absolute -bottom-2 left-2 right-2 h-3 rounded-sm"
            style={{ background: "rgba(0,0,0,0.25)", filter: "blur(4px)" }}
          />
        </div>

        {/* Instruction text */}
        <div
          className="text-center transition-all duration-500"
          style={{ opacity: touched ? 0 : 0.7 }}
        >
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: "#5a4a3a", fontFamily: "Georgia, serif" }}
          >
            Place your hand on the plaque
          </p>
        </div>

        {touched && !entering && (
          <div
            className="text-center animate-pulse"
            style={{ color: "#5a6a4a", fontFamily: "Georgia, serif", fontSize: "12px", letterSpacing: "0.2em" }}
          >
            Welcome...
          </div>
        )}
      </div>
    </div>
  );
}
