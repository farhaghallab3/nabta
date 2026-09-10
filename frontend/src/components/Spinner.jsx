export function Spinner({ label, full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-forest/70 ${
        full ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-forest/20 border-t-forest" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 w-full animate-pulse bg-forest-50" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-forest-50" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-forest-50" />
        <div className="h-2 w-full animate-pulse rounded bg-forest-50" />
      </div>
    </div>
  );
}
