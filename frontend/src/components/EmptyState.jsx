import { Sprout } from "./Icons";

export function EmptyState({ title, description, action, icon: Icon = Sprout }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-forest">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink/60">{description}</p>
      )}
      {action}
    </div>
  );
}
