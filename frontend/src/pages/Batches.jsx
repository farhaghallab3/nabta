import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { BatchCard } from "../components/BatchCard";
import { SkeletonCard } from "../components/Spinner";
import { EmptyState } from "../components/EmptyState";
import { num } from "../lib/format";

export default function Batches() {
  const { t } = useTranslation();
  const [batches, setBatches] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filters = [
    { key: "", label: t("common.all") },
    { key: "crop", label: t("common.crops") },
    { key: "animal", label: t("common.animals") },
  ];

  useEffect(() => {
    let active = true;
    setBatches(null);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    const t2 = setTimeout(
      () => {
        api
          .get("/batches/", { params })
          .then((res) => active && setBatches(res.data.results))
          .catch(() => active && setError(t("batches.loadError")));
      },
      search ? 300 : 0
    );
    return () => {
      active = false;
      clearTimeout(t2);
    };
  }, [search, category, t]);

  const count = useMemo(() => batches?.length ?? 0, [batches]);

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">
          {t("batches.title")}
        </h1>
        <p className="mt-2 text-ink/55">{t("batches.subtitle")}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setCategory(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === f.key
                  ? "bg-forest text-white"
                  : "bg-white text-ink/60 ring-1 ring-black/5 hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("batches.searchPlaceholder")}
          className="input sm:max-w-xs"
        />
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState title={t("common.somethingWrong")} description={error} />
        ) : batches === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : count === 0 ? (
          <EmptyState
            title={t("batches.noMatchTitle")}
            description={t("batches.noMatchText")}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-ink/45">
              {t("batches.count", { n: num(count) })}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {batches.map((b) => (
                <BatchCard key={b.id} batch={b} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
