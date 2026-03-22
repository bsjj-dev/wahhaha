"use client";

import { useState } from "react";
import Image from "next/image";
import { menu, categories, type MenuItem } from "@/data/menu";

interface MenuProps {
  onOrder: (item: MenuItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ onOrder, isOpen, onClose }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>("appetizers");

  if (!isOpen) return null;

  const filteredItems = menu.filter((item) => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border-2 border-[var(--wah-gold)]/40 rounded-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Menu header with logo */}
        <div className="bg-[var(--wah-red)] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Wah Ha Ha Thai Food"
              width={150}
              height={50}
              className="object-contain"
            />
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="text-sm text-white font-medium">MENU</p>
              <p className="text-xs text-white/60">1902 SW 13th St, Gainesville, FL</p>
              <p className="text-xs text-white/60">(352) 363-6327</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap border-b border-white/10 bg-[#2a2a2a] px-2 py-1 gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                activeCategory === cat.id
                  ? "bg-[var(--wah-red)] text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onOrder(item);
                onClose();
              }}
              className="menu-item w-full text-left px-4 py-3 rounded-lg flex items-start justify-between gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--wah-red)]/70 bg-[var(--wah-red)]/10 px-1.5 py-0.5 rounded">
                    {item.id}
                  </span>
                  <span className="font-semibold text-white">{item.name}</span>
                  {item.spicy && (
                    <span className="text-xs">{"🌶️".repeat(item.spicy)}</span>
                  )}
                </div>
                <div className="text-xs text-white/40 mt-1 ml-[calc(1.5rem+0.75rem)]">{item.description}</div>
                {item.note && (
                  <div className="text-[10px] text-[var(--wah-gold)]/50 mt-0.5 ml-[calc(1.5rem+0.75rem)]">{item.note}</div>
                )}
              </div>
              <div className="text-sm font-bold text-[var(--wah-gold)] whitespace-nowrap text-right shrink-0">
                {item.priceLabel || `$${item.price.toFixed(2)}`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
