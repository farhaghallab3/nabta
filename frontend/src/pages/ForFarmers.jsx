import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal } from "../components/Reveal";
import { ArrowRight, Leaf, QrIcon, Truck, Check } from "../components/Icons";

const FEATURE_ICONS = [Leaf, QrIcon, Truck];
const FEATURE_KEYS = ["register", "log", "loss"];

export default function ForFarmers() {
  const { t } = useTranslation();
  const needPoints = t("farmers.needPoints", { returnObjects: true });

  return (
    <div>
      <section className="container-page py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="badge">{t("farmers.badge")}</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {t("farmers.title")} <br />
              {t("farmers.titleLine2")}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/60">{t("farmers.text")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register?role=farmer" className="btn-primary">
                {t("farmers.registerCta")}{" "}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
              <Link to="/batches" className="btn-secondary">
                {t("farmers.seeLive")}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=70"
              alt=""
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft"
            />
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURE_KEYS.map((key, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Reveal key={key} delay={i * 90}>
                <div className="card h-full p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">
                    {t(`farmers.features.${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-ink/55">
                    {t(`farmers.features.${key}Text`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="card grid gap-8 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              {t("farmers.needTitle")}
            </h2>
            <p className="mt-2 text-sm text-ink/55">{t("farmers.needSubtitle")}</p>
          </div>
          <ul className="space-y-3 text-sm text-ink/65">
            {needPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
