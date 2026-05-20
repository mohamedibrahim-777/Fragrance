export default function Loading() {
  return (
    <main className="flex-grow pt-[140px] pb-margin px-gutter max-w-container-max-width mx-auto w-full">
      <header className="mb-margin border-b weathered-border pb-gutter">
        <div className="h-3 w-32 mb-3 shimmer rounded-sm" />
        <div className="h-12 w-2/3 max-w-xl shimmer rounded-sm mb-4" />
        <div className="h-4 w-full max-w-2xl shimmer rounded-sm" />
      </header>

      <div className="mb-6 flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 shimmer rounded-sm" />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bronze-card rounded-sm overflow-hidden h-[500px] flex flex-col"
          >
            <div className="shimmer h-3/5 w-full" />
            <div className="p-gutter flex flex-col gap-3 flex-grow">
              <div className="h-3 w-20 shimmer rounded-sm" />
              <div className="h-5 w-3/4 shimmer rounded-sm" />
              <div className="h-3 w-full shimmer rounded-sm" />
              <div className="h-3 w-5/6 shimmer rounded-sm" />
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <div className="h-6 w-20 shimmer rounded-sm" />
                <div className="h-10 w-10 shimmer rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
