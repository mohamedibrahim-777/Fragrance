export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[800px] px-5 py-8 sm:py-10 text-ink">
      <article className="space-y-4 text-base leading-relaxed text-ink-muted [&_h1]:mb-2 [&_h1]:mt-0 [&_h1]:font-display [&_h1]:text-4xl [&_h1]:font-medium [&_h1]:text-ink [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-ink">
        {children}
      </article>
    </div>
  );
}
