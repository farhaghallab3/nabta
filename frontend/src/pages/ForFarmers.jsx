import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { ArrowRight, Leaf, QrIcon, Truck, Check } from "../components/Icons";

const FEATURES = [
  {
    icon: Leaf,
    title: "Register a batch in under a minute",
    text: "Crop type, quantity, planting and harvest dates. We generate a unique QR code you can print and stick on every crate.",
  },
  {
    icon: QrIcon,
    title: "Log every stage from your phone",
    text: "Scan the batch QR, pick the stage, enter how much is good vs damaged. That's it — the timeline updates for every adopter.",
  },
  {
    icon: Truck,
    title: "See where you're losing product",
    text: "A simple per-stage loss breakdown across all your batches, so you know whether the problem is the field, the store, or the road.",
  },
];

export default function ForFarmers() {
  return (
    <div>
      <section className="container-page py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="badge">For farmers</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              Sell before harvest. <br />
              Lose less after it.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink/60">
              Nabta connects your farm directly to households in Cairo and beyond.
              Register your batches, track them by QR, and let people adopt a
              share before you've even picked.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register?role=farmer" className="btn-primary">
                Register as a farmer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/batches" className="btn-secondary">
                See live batches
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1000&q=70"
              alt="Farmer holding a crate of vegetables"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft"
            />
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="card h-full p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-ink/55">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="card grid gap-8 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              What you'll need
            </h2>
            <p className="mt-2 text-sm text-ink/55">
              No hardware, no integration. Just a phone.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-ink/65">
            {[
              "A Nabta farmer account (free)",
              "Your batch details — crop, quantity, dates",
              "A printer for the QR labels (or just save the image)",
              "Two minutes per stage to log an update",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
