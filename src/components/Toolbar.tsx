"use client";

interface ToolbarProps {
  micEnabled: boolean;
  camEnabled: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onOpenMenu: () => void;
  onLeave: () => void;
}

export default function Toolbar({
  micEnabled,
  camEnabled,
  onToggleMic,
  onToggleCam,
  onOpenMenu,
  onLeave,
}: ToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--wah-dark)]/90 border border-[var(--wah-wood)] rounded-full px-4 py-2 backdrop-blur-sm">
      <button
        onClick={onToggleMic}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
          micEnabled
            ? "bg-[var(--wah-wood)]/50 text-[var(--wah-cream)]"
            : "bg-red-600/80 text-white"
        }`}
        title={micEnabled ? "Mute" : "Unmute"}
      >
        {micEnabled ? "🎙️" : "🔇"}
      </button>
      <button
        onClick={onToggleCam}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
          camEnabled
            ? "bg-[var(--wah-wood)]/50 text-[var(--wah-cream)]"
            : "bg-red-600/80 text-white"
        }`}
        title={camEnabled ? "Camera off" : "Camera on"}
      >
        {camEnabled ? "📷" : "📷"}
      </button>
      <div className="w-px h-6 bg-[var(--wah-wood)]" />
      <button
        onClick={onOpenMenu}
        className="w-10 h-10 rounded-full bg-[var(--wah-gold)]/20 hover:bg-[var(--wah-gold)]/30 flex items-center justify-center text-lg transition-colors"
        title="Open Menu"
      >
        📋
      </button>
      <div className="w-px h-6 bg-[var(--wah-wood)]" />
      <button
        onClick={onLeave}
        className="w-10 h-10 rounded-full bg-red-700/60 hover:bg-red-700/80 flex items-center justify-center text-lg transition-colors"
        title="Leave table"
      >
        🚪
      </button>
    </div>
  );
}
