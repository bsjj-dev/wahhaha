"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase: passphrase.trim() }),
      });

      const data = await res.json();

      if (data.ok) {
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
      } else {
        setError("Wrong passphrase. Ask the crew.");
        setPassphrase("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        placeholder="Enter the passphrase"
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-[var(--wah-gold)]/30 text-[var(--wah-cream)] placeholder:text-[var(--wah-cream)]/30 focus:outline-none focus:border-[var(--wah-gold)]/60 text-center"
        autoFocus
        disabled={loading}
      />

      {error && (
        <p className="text-[var(--wah-red)] text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !passphrase.trim()}
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg, var(--wah-gold), #b8912f)",
          color: "var(--wah-dark)",
        }}
      >
        {loading ? "..." : "Enter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: "linear-gradient(180deg, #1a0f0a 0%, #0d0705 100%)" }}>
      <div className="w-full max-w-sm text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={67}
          className="mx-auto mb-8 opacity-80"
          priority
        />

        <p className="text-[var(--wah-cream)]/60 text-sm mb-6">
          Sunday night crew only.
        </p>

        <Suspense fallback={<div className="h-24" />}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-[var(--wah-cream)]/20 text-xs">
          If you know, you know.
        </p>
      </div>
    </div>
  );
}
