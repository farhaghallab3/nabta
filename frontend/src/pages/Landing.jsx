import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { BatchCard } from "../components/BatchCard";
import { SkeletonCard } from "../components/Spinner";
import { Reveal } from "../components/Reveal";
import {
  ArrowRight,
  Sprout,
  QrIcon,
  Truck,
  Home,
  Leaf,
  Check,
} from "../components/Icons";

const STEP_ICONS = [Leaf, Sprout, QrIcon, Home];
const STEP_KEYS = ["register", "adopt", "track", "deliver"];

export default function Landing() {
  const { t } = useTranslation();
  const [batches, setBatches] = useState(null);

  useEffect(() => {
    api
      .get("/batches/", { params: { ordering: "expected_harvest_date" } })
      .then((res) => setBatches(res.data.results.slice(0, 3)))
      .catch(() => setBatches([]));
  }, []);

  const stats = t("landing.stats", { returnObjects: true });
  const consumerPoints = t("landing.consumerPoints", { returnObjects: true });
  const farmerPoints = t("landing.farmerPoints", { returnObjects: true });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -end-40 -top-40 h-96 w-96 rounded-full bg-moss/20 blur-3xl" />
        <div className="pointer-events-none absolute -start-32 top-40 h-80 w-80 rounded-full bg-forest/10 blur-3xl" />
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="badge">{t("landing.badge")}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] text-ink sm:text-5xl lg:text-6xl">
              {t("landing.heroTitle")}{" "}
              <span className="text-forest">{t("landing.heroHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/60">
              {t("landing.heroText")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/batches" className="btn-primary">
                {t("landing.ctaBrowse")}{" "}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
              <Link to="/for-farmers" className="btn-secondary">
                {t("landing.ctaFarmers")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/50">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-forest" /> {t("landing.trustNoMiddlemen")}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-forest" /> {t("landing.trustQr")}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-forest" /> {t("landing.trustFair")}
              </span>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <img
              src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1000&q=70"
              alt=""
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 -start-6 hidden w-56 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5 sm:block">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
                  <Truck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-ink/50">{t("landing.cardInTransit")}</p>
                  <p className="text-sm font-semibold text-ink">
                    {t("landing.cardRoute")}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-forest-50">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-moss to-forest" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            {t("landing.howTitle")}
          </h2>
          <p className="mt-3 text-ink/55">{t("landing.howSubtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((key, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal key={key} delay={i * 90}>
                <div className="card h-full p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-moss">0{i + 1}</span>
                    <h3 className="text-lg font-bold text-ink">
                      {t(`landing.steps.${key}Title`)}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-ink/55">
                    {t(`landing.steps.${key}Text`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Consumers vs Farmers */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=70"
                alt=""
                className="h-48 w-full object-cover"
              />
              <div className="p-7">
                <span className="badge">{t("landing.forConsumers")}</span>
                <h3 className="mt-3 text-2xl font-bold text-ink">
                  {t("landing.consumerTitle")}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ink/60">
                  {consumerPoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link to="/batches" className="btn-primary mt-6">
                  {t("landing.ctaBrowse")}{" "}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=70"
                alt=""
                className="h-48 w-full object-cover"
              />
              <div className="p-7">
                <span className="badge">{t("landing.forFarmers")}</span>
                <h3 className="mt-3 text-2xl font-bold text-ink">
                  {t("landing.farmerTitle")}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ink/60">
                  {farmerPoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link to="/for-farmers" className="btn-secondary mt-6">
                  {t("landing.learnMore")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Problem / stats */}
      <section className="bg-forest py-16 text-white sm:py-20">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("landing.problemTitle")}
            </h2>
            <p className="mt-3 text-white/70">{t("landing.problemText")}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
                  <p className="text-4xl font-extrabold">{s.value}</p>
                  <p className="mt-2 text-sm text-white/70">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured batches */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">
              {t("landing.featuredTitle")}
            </h2>
            <p className="mt-2 text-ink/55">{t("landing.featuredSubtitle")}</p>
          </div>
          <Link
            to="/batches"
            className="hidden text-sm font-semibold text-forest hover:underline sm:block"
          >
            {t("landing.viewAll")} <span className="rtl-flip inline-block">→</span>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {batches === null
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : batches.map((b) => <BatchCard key={b.id} batch={b} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-8">
        <Reveal>
          <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-forest to-forest-700 p-10 text-center text-white sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {t("landing.ctaTitle")}
            </h2>
            <p className="max-w-md text-white/75">{t("landing.ctaText")}</p>
            <Link to="/register" className="btn bg-white text-forest hover:bg-white/90">
              {t("landing.ctaButton")}{" "}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
