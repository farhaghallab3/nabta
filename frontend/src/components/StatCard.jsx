export function StatCard({ label, value, hint, icon: Icon, accent = false }) {
  return (
    <div
      className={`card p-5 transition-transform duration-200 hover:-translate-y-0.5 ${
        accent ? "bg-forest text-white ring-forest" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-sm font-medium ${
              accent ? "text-white/70" : "text-ink/55"
            }`}
          >
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              accent ? "bg-white/15 text-white" : "bg-forest-50 text-forest"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      {hint && (
        <p
          className={`mt-2 text-xs ${accent ? "text-white/60" : "text-ink/45"}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
