import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf } from "./Icons";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 border-t border-black/5 bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold text-ink">
              {t("brand.name")}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink/55" dir="auto">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">{t("footer.explore")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/55">
            <li>
              <Link to="/batches" className="hover:text-forest">
                {t("nav.browse")}
              </Link>
            </li>
            <li>
              <Link to="/for-farmers" className="hover:text-forest">
                {t("nav.forFarmers")}
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-forest">
                {t("footer.createAccount")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">{t("footer.company")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/55">
            <li>{t("footer.about")}</li>
            <li>{t("footer.impact")}</li>
            <li>{t("footer.contact")}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">{t("footer.builtBy")}</h4>
          <p className="mt-3 text-sm text-ink/55" dir="auto">
            {t("footer.builtByText")}
          </p>
        </div>
      </div>
      <div className="border-t border-black/5 py-6">
        <p className="container-page text-xs text-ink/40">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
