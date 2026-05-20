export default function Loading() {
  return (
    <main className="flex-grow pt-[140px] pb-margin px-gutter max-w-container-max-width mx-auto w-full">
      <div className="mb-margin">
        <div className="h-10 w-64 shimmer rounded-sm mb-3" />
        <div className="h-4 w-96 shimmer rounded-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-margin">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bronze-card p-6 rounded-sm h-32 flex flex-col gap-3">
            <div className="h-3 w-20 shimmer rounded-sm" />
            <div className="h-8 w-24 shimmer rounded-sm" />
            <div className="h-3 w-32 shimmer rounded-sm mt-auto" />
          </div>
        ))}
      </div>
      <div className="bronze-card rounded-sm p-gutter">
        <div className="h-6 w-48 shimmer rounded-sm mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 w-full shimmer rounded-sm" />
          ))}
        </div>
      </div>
    </main>
  );
}
