"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl mb-4 select-none">⚠️</p>
      <h1 className="text-3xl font-extrabold text-white mb-2">
        Failed to load Pokémon
      </h1>
      <p className="text-white/70 mb-8 max-w-sm">
        Could not fetch this Pokémon&apos;s data. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-white text-rose-700 font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors">
          Try again
        </button>
        <Link
          href="/"
          className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors">
          ← Back to Pokédex
        </Link>
      </div>
    </main>
  );
}
