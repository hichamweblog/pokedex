import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white rounded-2xl p-10 shadow-xl max-w-sm w-full">
        <p className="text-8xl mb-4 select-none">🔍</p>
        <h1 className="text-2xl font-extrabold text-rose-900 mb-2">
          Pokémon Not Found
        </h1>
        <p className="text-rose-400 mb-6 text-sm">
          No Pokémon exists with that name or ID.
        </p>
        <Link
          href="/"
          className="inline-block bg-rose-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-rose-700 transition-colors w-full">
          ← Back to Pokédex
        </Link>
      </div>
    </main>
  );
}
