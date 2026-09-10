import { STAGES, stageIndex } from "../lib/format";
import { stageIcons, Check, Sprout } from "./Icons";

export function StageStepper({ currentStage, className = "" }) {
  const activeIdx = stageIndex(currentStage);

  return (
    <div className={className}>
      {/* Desktop: horizontal */}
      <ol className="hidden items-center sm:flex">
        {STAGES.map((stage, idx) => {
          const Icon = stageIcons[stage.key] || Sprout;
          const done = idx < activeIdx;
          const active = idx === activeIdx;
          return (
            <li key={stage.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2 text-center">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                    done
                      ? "border-forest bg-forest text-white"
                      : active
                      ? "border-forest bg-white text-forest shadow-soft"
                      : "border-forest/15 bg-white text-forest/30"
                  }`}
                >
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <span
                  className={`w-24 text-xs font-semibold ${
                    done || active ? "text-forest" : "text-ink/35"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {idx < STAGES.length - 1 && (
                <span
                  className={`mx-1 mb-6 h-0.5 flex-1 rounded ${
                    idx < activeIdx ? "bg-forest" : "bg-forest/15"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="space-y-0 sm:hidden">
        {STAGES.map((stage, idx) => {
          const Icon = stageIcons[stage.key] || Sprout;
          const done = idx < activeIdx;
          const active = idx === activeIdx;
          return (
            <li key={stage.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-forest bg-forest text-white"
                      : active
                      ? "border-forest bg-white text-forest"
                      : "border-forest/15 bg-white text-forest/30"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                {idx < STAGES.length - 1 && (
                  <span
                    className={`my-1 w-0.5 flex-1 ${
                      idx < activeIdx ? "bg-forest" : "bg-forest/15"
                    }`}
                  />
                )}
              </div>
              <span
                className={`pb-6 pt-1.5 text-sm font-semibold ${
                  done || active ? "text-forest" : "text-ink/35"
                }`}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
