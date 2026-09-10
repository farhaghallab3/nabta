import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-extrabold text-forest">404</p>
      <h1 className="mt-3 text-2xl font-bold text-ink">{t("notFound.title")}</h1>
      <p className="mt-2 text-ink/55">{t("notFound.text")}</p>
      <Link to="/" className="btn-primary mt-6">
        {t("common.backHome")}
      </Link>
    </div>
  );
}
