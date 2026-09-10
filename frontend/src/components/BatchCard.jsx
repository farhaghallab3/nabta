import { Link } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { MapPin } from "./Icons";
import { egp, stageLabel, daysUntil, PLACEHOLDER_IMG } from "../lib/format";

export function BatchCard({ batch }) {
  const days = daysUntil(batch.expected_harvest_date);
  return (
    <Link
      to={`/batches/${batch.id}`}
      className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={batch.image || PLACEHOLDER_IMG}
          alt={batch.crop_type}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 badge bg-white/90 backdrop-blur">
          {batch.category === "animal" ? "Animal" : "Crop"}
        </span>
        {batch.current_stage && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {stageLabel(batch.current_stage)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink">{batch.crop_type}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-ink/55">
          <MapPin className="h-3.5 w-3.5" />
          {batch.farm_name} · {batch.farm_location}
        </p>

        <div className="mt-4">
          <ProgressBar
            value={batch.growth_progress}
            label={
              days > 0
                ? `${days} days to harvest`
                : days === 0
                ? "Harvesting now"
                : "Harvest underway"
            }
          />
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-4">
          <div>
            <p className="text-xs text-ink/45">From</p>
            <p className="text-lg font-bold text-forest">
              {egp(batch.price_per_share)}
            </p>
          </div>
          <span className="text-xs font-medium text-ink/45">
            {batch.share_size_kg} kg / share
          </span>
        </div>
      </div>
    </Link>
  );
}
