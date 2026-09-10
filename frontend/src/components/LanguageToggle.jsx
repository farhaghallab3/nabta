import { useTranslation } from "react-i18next";
import { setLanguage } from "../i18n";
import { Globe } from "./Icons";

export function LanguageToggle({ className = "" }) {
  const { i18n, t } = useTranslation();
  const next = i18n.language === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={t("lang.switchTo")}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink/70 ring-1 ring-black/10 transition-colors hover:text-ink hover:ring-black/20 ${className}`}
    >
      <Globe className="h-4 w-4" />
      {t("lang.switchTo")}
    </button>
  );
}
