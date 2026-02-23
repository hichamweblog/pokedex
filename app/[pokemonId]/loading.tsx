export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="w-32 h-5 bg-white/20 rounded mb-8 animate-pulse" />

        {/* Header card skeleton */}
        <div className="bg-white rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8 mb-6 shadow-xl">
          <div className="w-52 h-52 bg-rose-100 rounded-xl animate-pulse shrink-0" />
          <div className="flex-1 w-full space-y-3">
            <div className="h-4 bg-rose-100 rounded w-16 animate-pulse" />
            <div className="h-9 bg-rose-100 rounded w-40 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-rose-100 rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-rose-100 rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-rose-50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats + Abilities skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="h-5 bg-rose-100 rounded w-24 animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-rose-50 rounded w-full animate-pulse" />
                <div className="h-2 bg-rose-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl space-y-3">
            <div className="h-5 bg-rose-100 rounded w-24 animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-rose-50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
