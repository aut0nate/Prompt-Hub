export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 md:px-8">
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-full bg-panel/80" />
        <div className="h-6 w-96 animate-pulse rounded-full bg-panel/70" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-panel/70" />
        ))}
      </div>
    </main>
  );
}
