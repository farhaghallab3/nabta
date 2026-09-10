import i18n from "../i18n";

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

export const STAGE_KEYS = [
  "harvest",
  "cold_storage",
  "transport",
  "market",
  "delivered",
];

export function stageIndex(stage) {
  return STAGE_KEYS.indexOf(stage);
}

export function stageLabel(stage) {
  if (!stage) return i18n.t("stages.growing");
  return i18n.t(`stages.${stage}`, { defaultValue: i18n.t("stages.growing") });
}

function locale() {
  return i18n.language === "ar" ? "ar-EG" : "en-GB";
}

export function egp(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat(i18n.language === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function num(value) {
  return new Intl.NumberFormat(locale()).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(locale(), {
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
