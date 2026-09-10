export function ProgressBar({ value = 0, label, className = "" }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink/60">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-forest-50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss to-forest transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
