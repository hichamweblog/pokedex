import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-9xl font-black text-white/20 select-none">404</p>
      <h1 className="text-3xl font-extrabold text-white mt-2 mb-2">
        Page Not Found
      </h1>
      <p className="text-white/70 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-white text-rose-700 font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors">
        ← Back to Pokédex
      </Link>
    </main>
  );
}
