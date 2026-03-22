"use client";

import { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isStaff?: boolean;
}

interface ChatProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  currentUser: string;
}

export default function Chat({ messages, onSend, currentUser }: ChatProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[var(--wah-dark)]/95 border-l border-[var(--wah-wood)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--wah-wood)] bg-[var(--wah-wood)]/30">
        <h3 className="text-sm font-bold text-[var(--wah-gold)]">Table Talk</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser;
          return (
            <div key={msg.id} className={`chat-message ${isMe ? "text-right" : ""}`}>
              {msg.isStaff ? (
                <div className="bg-[var(--wah-red)]/20 border border-[var(--wah-red)]/30 rounded-lg p-2">
                  <div className="text-xs text-[var(--wah-gold)] font-semibold">{msg.sender}</div>
                  <div className="text-sm text-[var(--wah-cream)]">{msg.text}</div>
                </div>
              ) : (
                <div>
                  {!isMe && (
                    <div className="text-xs text-[var(--wah-gold)]/70 mb-0.5">{msg.sender}</div>
                  )}
                  <div
                    className={`inline-block rounded-lg px-3 py-1.5 text-sm max-w-[85%] ${
                      isMe
                        ? "bg-[var(--wah-gold)]/20 text-[var(--wah-cream)]"
                        : "bg-[var(--wah-wood)]/50 text-[var(--wah-cream)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--wah-wood)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            className="flex-1 bg-[var(--wah-wood)]/40 border border-[var(--wah-wood)] rounded-lg px-3 py-2 text-sm text-[var(--wah-cream)] placeholder:text-[var(--wah-cream)]/30 focus:outline-none focus:border-[var(--wah-gold)]/50"
          />
          <button
            type="submit"
            className="bg-[var(--wah-gold)]/20 hover:bg-[var(--wah-gold)]/30 text-[var(--wah-gold)] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
