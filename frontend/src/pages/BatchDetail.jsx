import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Spinner";
import { EmptyState } from "../components/EmptyState";
import { ProgressBar } from "../components/ProgressBar";
import { StageStepper } from "../components/StageStepper";
import { MapPin, ArrowRight, Check, stageIcons, Sprout } from "../components/Icons";
import {
  egp,
  formatDate,
  daysUntil,
  stageLabel,
  num,
  PLACEHOLDER_IMG,
} from "../lib/format";

function Timeline({ events }) {
  const { t } = useTranslation();
  if (!events.length) {
    return (
      <p className="rounded-xl bg-cream p-4 text-sm text-ink/50">
        {t("batchDetail.noEvents")}
      </p>
    );
  }
  return (
    <ol className="space-y-4">
      {events.map((e) => {
        const Icon = stageIcons[e.stage] || Sprout;
        return (
          <li key={e.id} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex-1 rounded-xl bg-cream p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">{stageLabel(e.stage)}</p>
                <span className="text-xs text-ink/45">
                  {formatDate(e.timestamp)}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/55">
                {t("batchDetail.goodCondition", { n: num(e.quantity_ok) })}
                {Number(e.quantity_damaged) > 0 && (
                  <span className="text-red-600">
                    {" "}
                    {t("batchDetail.lost", {
                      n: num(e.quantity_damaged),
                      pct: e.loss_pct,
                    })}
                  </span>
                )}
              </p>
              {e.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-ink/45">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {e.location}
                </p>
              )}
              {e.note && <p className="mt-1 text-xs text-ink/50">{e.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function BatchDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user, isConsumer } = useAuth();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [adopting, setAdopting] = useState(false);
  const [adoptError, setAdoptError] = useState(null);
  const [adopted, setAdopted] = useState(false);

  useEffect(() => {
    setBatch(null);
    api
      .get(`/batches/${id}/`)
      .then((res) => {
        setBatch(res.data);
        setAdopted(res.data.is_adopted);
      })
      .catch(() => setError(t("batchDetail.notFoundText")));
  }, [id, t]);

  async function adopt() {
    setAdopting(true);
    setAdoptError(null);
    try {
      await api.post(`/batches/${id}/adopt/`, { quantity_committed: qty });
      setAdopted(true);
      setTimeout(() => navigate("/my-adoptions"), 900);
    } catch (err) {
      setAdoptError(apiErrorMessage(err, t("batchDetail.adoptError")));
    } finally {
      setAdopting(false);
    }
  }

  if (error)
    return (
      <div className="container-page py-16">
        <EmptyState
          title={t("batchDetail.notFoundTitle")}
          description={error}
          action={
            <Link to="/batches" className="btn-primary mt-2">
              {t("batchDetail.backToBatches")}
            </Link>
          }
        />
      </div>
    );

  if (!batch) return <Spinner full label={t("batchDetail.loading")} />;

  const days = daysUntil(batch.expected_harvest_date);
  const total = egp(Number(batch.price_per_share) * qty);

  return (
    <div className="container-page py-10">
      <Link to="/batches" className="text-sm font-medium text-forest hover:underline">
        <span className="rtl-flip inline-block">←</span> {t("batchDetail.back")}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <img
            src={batch.image || PLACEHOLDER_IMG}
            alt={batch.crop_type}
            className="aspect-[16/10] w-full rounded-2xl object-cover shadow-card"
          />

          <div className="mt-6">
            <span className="badge">
              {batch.category === "animal" ? t("common.animal") : t("common.crop")}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
              {batch.crop_type}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink/55">
              <MapPin className="h-4 w-4 shrink-0" />
              {batch.farm.name} · {batch.farm.location}
            </p>
            {batch.description && (
              <p className="mt-4 text-ink/65">{batch.description}</p>
            )}
            {batch.farm.story && (
              <div className="mt-4 rounded-xl bg-forest-50 p-4 text-sm text-forest-900">
                <p className="font-semibold">
                  {t("batchDetail.about", { name: batch.farm.name })}
                </p>
                <p className="mt-1 text-forest-900/80">{batch.farm.story}</p>
              </div>
            )}
          </div>

          <div className="mt-8 card p-6">
            <h2 className="text-lg font-bold text-ink">
              {t("batchDetail.journey")}
            </h2>
            <StageStepper currentStage={batch.current_stage} className="mt-6" />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-ink">
              {t("batchDetail.timeline")}
            </h2>
            <div className="mt-4">
              <Timeline events={batch.events} />
            </div>
          </div>
        </div>

        {/* Adopt panel */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-ink/45">{t("batchDetail.perShare")}</p>
                <p className="text-3xl font-bold text-forest">
                  {egp(batch.price_per_share)}
                </p>
              </div>
              <span className="text-sm text-ink/45">
                {t("common.kg", { n: num(batch.share_size_kg) })}
              </span>
            </div>

            <ProgressBar
              className="mt-5"
              value={batch.growth_progress}
              label={
                days > 0
                  ? t("common.harvestInDays", { n: days })
                  : t("common.harvestUnderway")
              }
            />
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/50">{t("batchDetail.planted")}</dt>
                <dd className="font-medium">{formatDate(batch.planted_date)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">{t("batchDetail.expectedHarvest")}</dt>
                <dd className="font-medium">
                  {formatDate(batch.expected_harvest_date)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">{t("batchDetail.batchSize")}</dt>
                <dd className="font-medium">
                  {t("common.kg", { n: num(batch.quantity_kg) })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">{t("batchDetail.currentStage")}</dt>
                <dd className="font-medium">{stageLabel(batch.current_stage)}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-black/5 pt-6">
              {adopted ? (
                <div className="flex items-center gap-2 rounded-xl bg-forest-50 p-4 text-sm font-semibold text-forest">
                  <Check className="h-5 w-5 shrink-0" /> {t("batchDetail.adopted")}
                </div>
              ) : !user ? (
                <>
                  <p className="text-sm text-ink/55">
                    {t("batchDetail.loginToAdoptText")}
                  </p>
                  <Link
                    to="/login"
                    state={{ from: `/batches/${id}` }}
                    className="btn-primary mt-3 w-full"
                  >
                    {t("batchDetail.loginToAdopt")}
                  </Link>
                </>
              ) : !isConsumer ? (
                <p className="rounded-xl bg-cream p-4 text-sm text-ink/55">
                  {t("batchDetail.farmerCantAdopt")}
                </p>
              ) : (
                <>
                  <label className="label">{t("batchDetail.shares")}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) =>
                        setQty(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="input w-24"
                    />
                    <span className="text-sm text-ink/55">
                      {t("batchDetail.equalsKg", {
                        n: num(qty * batch.share_size_kg),
                      })}
                    </span>
                  </div>
                  {adoptError && (
                    <p className="mt-2 text-sm text-red-600">{adoptError}</p>
                  )}
                  <button
                    onClick={adopt}
                    disabled={adopting}
                    className="btn-primary mt-4 w-full"
                  >
                    {adopting
                      ? t("batchDetail.adopting")
                      : t("batchDetail.adoptButton", { total })}
                    {!adopting && <ArrowRight className="h-4 w-4 rtl-flip" />}
                  </button>
                  <p className="mt-2 text-center text-xs text-ink/40">
                    {t("common.noPayment")}
                  </p>
                </>
              )}
            </div>
          </div>

          {batch.qr_image && (
            <div className="card mt-6 p-6 text-center">
              <p className="text-sm font-semibold text-ink">
                {t("batchDetail.qrTitle")}
              </p>
              <img
                src={batch.qr_image}
                alt=""
                className="mx-auto mt-3 h-40 w-40"
              />
              <p className="mt-2 font-mono text-xs text-ink/40" dir="ltr">
                {batch.qr_code}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
