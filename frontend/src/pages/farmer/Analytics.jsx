import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../lib/api";
import { Spinner } from "../../components/Spinner";
import { EmptyState } from "../../components/EmptyState";
import { StatCard } from "../../components/StatCard";
import { Truck, Sprout } from "../../components/Icons";
import { stageLabel, num } from "../../lib/format";

export default function Analytics() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/farmer/analytics/")
      .then((res) => setData(res.data))
      .catch(() => setError(t("analytics.loadError")));
  }, [t]);

  if (error)
    return (
      <div className="container-page py-16">
        <EmptyState title={t("common.somethingWrong")} description={error} />
      </div>
    );
  if (!data) return <Spinner full label={t("analytics.loading")} />;

  const chartData = data.by_stage
    .filter((s) => s.quantity_ok + s.quantity_damaged > 0)
    .map((s) => ({ ...s, name: stageLabel(s.stage) }));

  return (
    <div className="container-page py-12">
      <Link to="/farmer" className="text-sm font-medium text-forest hover:underline">
        <span className="rtl-flip inline-block">←</span> {t("analytics.back")}
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-ink">{t("analytics.title")}</h1>
      <p className="mt-2 text-ink/55">{t("analytics.subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("analytics.statLoss")}
          value={`${num(data.overall_loss_pct)}%`}
          icon={Truck}
          accent
        />
        <StatCard
          label={t("analytics.statActive")}
          value={num(data.active_batches)}
          icon={Sprout}
        />
        <StatCard
          label={t("analytics.statShipments")}
          value={num(data.tracked_shipments)}
          icon={Truck}
        />
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-lg font-bold text-ink">{t("analytics.chartTitle")}</h2>
        {chartData.length === 0 ? (
          <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-ink/50">
            {t("analytics.chartEmpty")}
          </p>
        ) : (
          <div className="mt-6 h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#1B2B1C" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  unit="%"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(151,188,98,0.12)" }}
                  formatter={(v) => [`${v}%`, t("analytics.tooltipLoss")]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.06)",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="loss_pct" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.loss_pct > 8 ? "#b91c1c" : "#2C5F2D"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-start text-ink/55">
            <tr>
              <th className="px-5 py-3 text-start font-semibold">
                {t("analytics.colStage")}
              </th>
              <th className="px-5 py-3 text-start font-semibold">
                {t("analytics.colGood")}
              </th>
              <th className="px-5 py-3 text-start font-semibold">
                {t("analytics.colDamaged")}
              </th>
              <th className="px-5 py-3 text-start font-semibold">
                {t("analytics.colLoss")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.by_stage.map((s) => (
              <tr key={s.stage} className="border-t border-black/5">
                <td className="px-5 py-3 font-medium text-ink">
                  {stageLabel(s.stage)}
                </td>
                <td className="px-5 py-3 text-ink/65">{num(s.quantity_ok)}</td>
                <td className="px-5 py-3 text-ink/65">{num(s.quantity_damaged)}</td>
                <td className="px-5 py-3">
                  <span
                    className={`font-semibold ${
                      s.loss_pct > 8 ? "text-red-600" : "text-forest"
                    }`}
                  >
                    {num(s.loss_pct)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
