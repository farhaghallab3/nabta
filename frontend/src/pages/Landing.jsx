import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

const STEPS = [
  {
    icon: Leaf,
    title: "Register",
    text: "Farmers list a crop or animal batch with planting and harvest dates.",
  },
  {
    icon: Sprout,
    title: "Adopt",
    text: "You claim a share and get a direct line to that specific batch.",
  },
  {
    icon: QrIcon,
    title: "Track",
    text: "Every stage is scanned via QR — harvest, cold storage, transport, market.",
  },
  {
    icon: Home,
    title: "Deliver",
    text: "Your share arrives at your door with its full, honest journey attached.",
  },
];

const STATS = [
  { value: "30%+", label: "of Egypt's produce is lost after harvest" },
  { value: "0", label: "transparency for the average shopper today" },
  { value: "5+", label: "supply-chain hops between farm and plate" },
  { value: "100%", label: "of Nabta batches are QR-traced end to end" },
];

export default function Landing() {
  const [batches, setBatches] = useState(null);

  useEffect(() => {
    api
      .get("/batches/", { params: { ordering: "expected_harvest_date" } })
      .then((res) => setBatches(res.data.results.slice(0, 3)))
      .catch(() => setBatches([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-moss/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-forest/10 blur-3xl" />
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="badge">🌱 Farm-to-door, fully traceable</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              From the field to your door —{" "}
              <span className="text-forest">fully transparent</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/60">
              Adopt a share of a real Egyptian farm. Follow your tomatoes, olives,
              eggs or honey through every step of the journey — and cut the waste
              that happens in the dark.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/batches" className="btn-primary">
                Browse Batches <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/for-farmers" className="btn-secondary">
                For Farmers
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-ink/50">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-forest" /> No middlemen
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-forest" /> QR-verified
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-forest" /> Fair to farmers
              </span>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <img
              src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1000&q=70"
              alt="Farmer harvesting fresh produce"
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5 sm:block">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-white">
                  <Truck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-ink/50">In transit</p>
                  <p className="text-sm font-semibold text-ink">Fayoum → Cairo</p>
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
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">How it works</h2>
          <p className="mt-3 text-ink/55">
            Four steps between a seed in the ground and a box at your door.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="card h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest">
                  <step.icon className="h-6 w-6" />
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-bold text-moss">
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-ink/55">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Consumers vs Farmers */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=70"
                alt="Fresh vegetables at a market"
                className="h-48 w-full object-cover"
              />
              <div className="p-7">
                <span className="badge">For consumers</span>
                <h3 className="mt-3 text-2xl font-bold text-ink">
                  Know exactly where your food came from
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ink/60">
                  {[
                    "Adopt a share of a specific batch, not a vague label",
                    "Watch a live timeline with photos from the farm",
                    "See the real loss at each stage — nothing hidden",
                    "Support Egyptian farms directly, at a fair price",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link to="/batches" className="btn-primary mt-6">
                  Browse Batches <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=70"
                alt="Farmer in a field"
                className="h-48 w-full object-cover"
              />
              <div className="p-7">
                <span className="badge">For farmers</span>
                <h3 className="mt-3 text-2xl font-bold text-ink">
                  Sell before harvest, lose less after it
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ink/60">
                  {[
                    "Register a batch and get a printable QR label in seconds",
                    "Log each stage from your phone — harvest to market",
                    "See loss analytics per stage across all your batches",
                    "Build a direct relationship with the people who eat your food",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link to="/for-farmers" className="btn-secondary mt-6">
                  Learn more
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
              The supply chain wastes what farmers grow
            </h2>
            <p className="mt-3 text-white/70">
              Produce changes hands five or more times before it reaches a plate.
              At every hop, some is lost — and the shopper never sees any of it.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
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
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">
              Harvesting soon
            </h2>
            <p className="mt-2 text-ink/55">Adopt a share before it's picked.</p>
          </div>
          <Link
            to="/batches"
            className="hidden text-sm font-semibold text-forest hover:underline sm:block"
          >
            View all →
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
              Start following your food
            </h2>
            <p className="max-w-md text-white/75">
              Create a free account as a consumer or a farmer and see the whole
              journey — nothing hidden.
            </p>
            <Link
              to="/register"
              className="btn bg-white text-forest hover:bg-white/90"
            >
              Create your account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
