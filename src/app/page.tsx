"use client";

import Link from "next/link";
import Image from "next/image";
import { getAllLocations } from "@/data/locations";

export default function Home() {
  const locations = getAllLocations();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[var(--wah-cream)] mb-2">Sunday Dinner</h1>
          <p className="text-white/40 text-sm">Pick a spot. Your table is waiting.</p>
        </div>

        <div className="space-y-4">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/${loc.id}`}
              className="block p-6 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-black/30">
                  <Image
                    src={loc.logoCircle || loc.logo}
                    alt={loc.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg group-hover:opacity-100 opacity-80 transition-opacity">
                    {loc.name}
                  </div>
                  <div className="text-xs opacity-40 mt-0.5">{loc.subtitle}</div>
                  <div className="text-xs opacity-30 mt-1">{loc.address}</div>
                </div>
                <div className="text-white/20 group-hover:text-white/40 text-xl transition-colors">
                  &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-white/15 text-xs mt-8">
          Sunday night crew only
        </p>
      </div>
    </div>
  );
}
