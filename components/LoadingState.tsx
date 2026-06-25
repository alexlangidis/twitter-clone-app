function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

export function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_40%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.16))] px-4">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-8 shadow-2xl shadow-black/5 backdrop-blur">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full bg-primary/15" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Skeleton className="h-11 w-full rounded-2xl" />
          <Skeleton className="h-11 w-full rounded-2xl" />
          <Skeleton className="h-11 w-2/3 rounded-2xl" />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedLoading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.10),_transparent_24%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.12))]">
      <div className="mx-auto flex h-screen w-full max-w-7xl">
        <aside className="hidden w-64 border-r border-border/70 bg-background/75 px-4 py-5 backdrop-blur xl:flex xl:flex-col">
          <div className="flex items-center gap-3 px-3">
            <Skeleton className="h-9 w-9 rounded-full bg-primary/15" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="mt-8 space-y-3 px-2">
            <Skeleton className="h-11 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>

          <div className="mt-auto rounded-3xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-4 py-4 sm:px-6">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-2/3 rounded-full" />
                  <Skeleton className="h-4 w-5/6 rounded-full" />
                  <div className="flex items-center gap-3 pt-2">
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="h-9 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <article
                  key={index}
                  className="rounded-3xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-11/12 rounded-full" />
                      <Skeleton className="h-4 w-4/5 rounded-full" />
                      <Skeleton className="h-52 w-full rounded-2xl" />
                      <div className="flex items-center gap-5 pt-2">
                        <Skeleton className="h-9 w-16 rounded-full" />
                        <Skeleton className="h-9 w-16 rounded-full" />
                        <Skeleton className="h-9 w-16 rounded-full" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LoadingState() {
  return <FeedLoading />;
}
