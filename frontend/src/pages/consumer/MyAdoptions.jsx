import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/Spinner";
import { EmptyState } from "../../components/EmptyState";
import { StageStepper } from "../../components/StageStepper";
import { StatCard } from "../../components/StatCard";
import { Sprout, Truck, Check, MapPin } from "../../components/Icons";
import {
  formatDate,
  stageLabel,
  daysUntil,
  num,
  PLACEHOLDER_IMG,
} from "../../lib/format";

export default function MyAdoptions() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/my-adoptions/")
      .then((res) => setItems(res.data.results))
      .catch(() => setError(t("adoptions.loadError")));
  }, [t]);

  if (error)
    return (
      <div className="container-page py-16">
        <EmptyState title={t("common.somethingWrong")} description={error} />
      </div>
    );
  if (!items) return <Spinner full label={t("adoptions.loading")} />;

  const delivered = items.filter(
    (i) => i.batch_detail.current_stage === "delivered"
  ).length;
  const inTransit = items.filter((i) =>
    ["transport", "market"].includes(i.batch_detail.current_stage)
  ).length;

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-ink sm:text-4xl">
        {t("adoptions.title")}
      </h1>
      <p className="mt-2 text-ink/55">
        {t("adoptions.subtitle", { name: user.first_name || user.username })}
      </p>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title={t("adoptions.emptyTitle")}
            description={t("adoptions.emptyText")}
            action={
              <Link to="/batches" className="btn-primary mt-2">
                {t("adoptions.browseBatches")}
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label={t("adoptions.statAdopted")}
              value={num(items.length)}
              icon={Sprout}
            />
            <StatCard
              label={t("adoptions.statMoving")}
              value={num(inTransit)}
              icon={Truck}
            />
            <StatCard
              label={t("adoptions.statDelivered")}
              value={num(delivered)}
              icon={Check}
              accent
            />
          </div>

          <div className="mt-10 space-y-6">
            {items.map((item) => {
              const b = item.batch_detail;
              const days = daysUntil(b.expected_harvest_date);
              const shareCount = Number(item.quantity_committed);
              return (
                <div key={item.id} className="card overflow-hidden">
                  <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
                    <Link to={`/batches/${b.id}`} className="group block">
                      <img
                        src={b.image || PLACEHOLDER_IMG}
                        alt={b.crop_type}
                        className="h-40 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <h3 className="mt-3 text-lg font-bold text-ink group-hover:text-forest">
                        {b.crop_type}
                      </h3>
                      <p className="flex items-center gap-1 text-sm text-ink/55">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {b.farm_name}
                      </p>
                      <p className="mt-1 text-xs text-ink/45">
                        {t(
                          shareCount === 1
                            ? "adoptions.shareAdopted"
                            : "adoptions.sharesAdopted",
                          { n: num(shareCount), date: formatDate(item.created_at) }
                        )}
                      </p>
                    </Link>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="badge">{stageLabel(b.current_stage)}</span>
                        <span className="text-xs text-ink/45">
                          {days > 0
                            ? t("common.harvestInDays", { n: days })
                            : t("common.harvestUnderway")}
                        </span>
                      </div>
                      <StageStepper
                        currentStage={b.current_stage}
                        className="mt-6"
                      />
                      <div className="mt-4 flex flex-wrap gap-3 border-t border-black/5 pt-4 text-sm">
                        <span className="text-ink/50">
                          {t("adoptions.latestUpdates")}
                        </span>
                        {item.events.slice(-3).map((e) => (
                          <span
                            key={e.id}
                            className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink/60"
                          >
                            {stageLabel(e.stage)} · {formatDate(e.timestamp)}
                          </span>
                        ))}
                        {item.events.length === 0 && (
                          <span className="text-xs text-ink/40">
                            {t("adoptions.noneYet")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
