import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/farmer/analytics/")
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load analytics."));
  }, []);

  if (error)
    return (
      <div className="container-page py-16">
        <EmptyState title="Something went wrong" description={error} />
      </div>
    );
  if (!data) return <Spinner full label="Crunching numbers…" />;

  const chartData = data.by_stage.filter(
    (s) => s.quantity_ok + s.quantity_damaged > 0
  );

  return (
    <div className="container-page py-12">
      <Link to="/farmer" className="text-sm font-medium text-forest hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-ink">Loss analytics</h1>
      <p className="mt-2 text-ink/55">
        Where product is lost across every stage of every batch you track.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Overall loss"
          value={`${data.overall_loss_pct}%`}
          icon={Truck}
          accent
        />
        <StatCard
          label="Active batches"
          value={data.active_batches}
          icon={Sprout}
        />
        <StatCard
          label="Tracked shipments"
          value={data.tracked_shipments}
          icon={Truck}
        />
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-lg font-bold text-ink">Loss % by stage</h2>
        {chartData.length === 0 ? (
          <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-ink/50">
            Log some tracking events to see your loss breakdown here.
          </p>
        ) : (
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="label"
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
                  formatter={(v) => [`${v}%`, "Loss"]}
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

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-ink/55">
            <tr>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Good (kg)</th>
              <th className="px-5 py-3 font-semibold">Damaged (kg)</th>
              <th className="px-5 py-3 font-semibold">Loss %</th>
            </tr>
          </thead>
          <tbody>
            {data.by_stage.map((s) => (
              <tr key={s.stage} className="border-t border-black/5">
                <td className="px-5 py-3 font-medium text-ink">{s.label}</td>
                <td className="px-5 py-3 text-ink/65">{s.quantity_ok}</td>
                <td className="px-5 py-3 text-ink/65">{s.quantity_damaged}</td>
                <td className="px-5 py-3">
                  <span
                    className={`font-semibold ${
                      s.loss_pct > 8 ? "text-red-600" : "text-forest"
                    }`}
                  >
                    {s.loss_pct}%
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
