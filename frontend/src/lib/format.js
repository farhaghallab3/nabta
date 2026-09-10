// Neutral leaf-tinted placeholder for batches/farms with no photo yet.
export const PLACEHOLDER_IMG =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#97BC62"/><stop offset="1" stop-color="#2C5F2D"/>
      </linearGradient></defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <path d="M400 250c-60 0-110 50-110 110 0 60 50 110 110 110 40-70 40-150 0-220z" fill="#ffffff" opacity="0.28"/>
    </svg>`
  );

export const STAGES = [
  { key: "harvest", label: "Harvested" },
  { key: "cold_storage", label: "Cold Storage" },
  { key: "transport", label: "In Transit" },
  { key: "market", label: "At Market" },
  { key: "delivered", label: "Delivered" },
];

export function stageIndex(stage) {
  const i = STAGES.findIndex((s) => s.key === stage);
  return i === -1 ? -1 : i;
}

export function stageLabel(stage) {
  return STAGES.find((s) => s.key === stage)?.label || "Growing";
}

export function egp(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(value) {
  if (!value) return null;
  const diff = new Date(value) - new Date();
  return Math.round(diff / 86400000);
}
