export default function Loading() {
  return (
    <main className="flex-grow max-w-container-max-width mx-auto w-full px-gutter py-margin grid grid-cols-1 md:grid-cols-12 gap-margin mt-16">
      <div className="md:col-span-6">
        <div className="relative rounded-full overflow-hidden border border-outline-variant/30 aspect-[3/4] shimmer" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-16 shimmer rounded" />
          ))}
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <div className="h-3 w-40 shimmer rounded-sm" />
          <div className="h-12 w-3/4 shimmer rounded-sm" />
          <div className="h-4 w-full shimmer rounded-sm" />
          <div className="h-4 w-5/6 shimmer rounded-sm" />
          <div className="h-8 w-40 shimmer rounded-sm" />
        </div>
        <div className="space-y-3">
          <div className="h-6 w-48 shimmer rounded-sm" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-24 shimmer rounded-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <div className="h-6 w-40 shimmer rounded-sm" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`h-20 shimmer rounded-xl ${i === 2 ? "sm:col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-8">
          <div className="h-14 flex-1 shimmer rounded" />
          <div className="h-14 flex-1 shimmer rounded" />
          <div className="h-14 w-14 shimmer rounded" />
        </div>
      </div>
    </main>
  );
}
