"use client";

import { useEffect, useState } from "react";

interface StaffMessageProps {
  staffName: string;
  staffAvatar: string;
  message: string;
  onDismiss: () => void;
}

export default function StaffMessage({ staffName, staffAvatar, message, onDismiss }: StaffMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="bg-[var(--wah-red)] border-2 border-[var(--wah-gold)]/40 rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 max-w-md">
        <span className="text-3xl">{staffAvatar}</span>
        <div>
          <div className="text-xs font-bold text-[var(--wah-gold)]">{staffName}</div>
          <div className="text-sm text-[var(--wah-cream)]">{message}</div>
        </div>
      </div>
    </div>
  );
}
