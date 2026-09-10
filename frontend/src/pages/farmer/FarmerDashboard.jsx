import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/Spinner";
import { EmptyState } from "../../components/EmptyState";
import { StatCard } from "../../components/StatCard";
import { ProgressBar } from "../../components/ProgressBar";
import { Sprout, Truck, QrIcon, ArrowRight } from "../../components/Icons";
import { egp, stageLabel, daysUntil, PLACEHOLDER_IMG } from "../../lib/format";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [batches, setBatches] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/batches/", { params: { mine: 1 } }),
      api.get("/farmer/analytics/"),
    ])
      .then(([b, a]) => {
        setBatches(b.data.results);
        setAnalytics(a.data);
      })
      .catch(() => setError("Couldn't load your dashboard."));
  }, []);

  if (error)
    return (
      <div className="container-page py-16">
        <EmptyState title="Something went wrong" description={error} />
      </div>
    );
  if (!batches || !analytics)
    return <Spinner full label="Loading your dashboard…" />;

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">
            Farmer dashboard
          </h1>
          <p className="mt-2 text-ink/55">
            {user.first_name || user.username} — your batches and shipments.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/farmer/analytics" className="btn-secondary">
            View analytics
          </Link>
          <Link to="/farmer/batches/new" className="btn-primary">
            Register batch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active batches"
          value={analytics.active_batches}
          icon={Sprout}
        />
        <StatCard
          label="Tracked shipments"
          value={analytics.tracked_shipments}
          icon={Truck}
        />
        <StatCard
          label="Total adoptions"
          value={analytics.total_adoptions}
          icon={QrIcon}
        />
        <StatCard
          label="Overall loss"
          value={`${analytics.overall_loss_pct}%`}
          hint="Across all logged stages"
          accent
        />
      </div>

      <h2 className="mt-12 text-xl font-bold text-ink">Your batches</h2>
      {batches.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No batches yet"
            description="Register your first batch to generate a QR label and start tracking."
            action={
              <Link to="/farmer/batches/new" className="btn-primary mt-2">
                Register batch
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {batches.map((b) => {
            const days = daysUntil(b.expected_harvest_date);
            return (
              <div key={b.id} className="card p-5">
                <div className="flex gap-4">
                  <img
                    src={b.image || PLACEHOLDER_IMG}
                    alt={b.crop_type}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-lg font-bold text-ink">
                        {b.crop_type}
                      </h3>
                      <span className="badge shrink-0">
                        {stageLabel(b.current_stage)}
                      </span>
                    </div>
                    <p className="text-sm text-ink/55">
                      {b.farm_name} · {b.quantity_kg} kg
                    </p>
                    <p className="mt-0.5 text-xs text-ink/45">
                      {egp(b.price_per_share)} / share ·{" "}
                      {days > 0 ? `harvest in ${days}d` : "harvest underway"}
                    </p>
                    <ProgressBar className="mt-3" value={b.growth_progress} />
                  </div>
                </div>
                <div className="mt-4 flex gap-2 border-t border-black/5 pt-4">
                  <Link
                    to={`/farmer/batches/${b.id}/log`}
                    className="btn-primary flex-1 py-2 text-xs"
                  >
                    Log stage
                  </Link>
                  <Link
                    to={`/batches/${b.id}`}
                    className="btn-secondary flex-1 py-2 text-xs"
                  >
                    View public page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
