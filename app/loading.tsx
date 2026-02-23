export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center mb-8 text-white">
        Pokédex
      </h1>
      <div className="w-full max-w-xl mx-auto h-11 bg-white/20 rounded-md mb-12 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/20 rounded-lg p-4 h-52 animate-pulse"
          />
        ))}
      </div>
    </main>
  );
}
