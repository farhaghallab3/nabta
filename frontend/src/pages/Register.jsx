import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/api";
import { Leaf, Sprout, Home } from "../components/Icons";

const ROLES = [
  {
    key: "consumer",
    title: "I'm a consumer",
    text: "Adopt shares of farms and follow your food home.",
    icon: Home,
  },
  {
    key: "farmer",
    title: "I'm a farmer",
    text: "List batches, track shipments, cut post-harvest loss.",
    icon: Sprout,
  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    role: params.get("role") === "farmer" ? "farmer" : "consumer",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await register({
        ...form,
        username: form.username.trim(),
      });
      navigate(user.role === "farmer" ? "/farmer" : "/my-adoptions", {
        replace: true,
      });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create your account."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[85vh] items-center justify-center py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold text-ink">Nabta</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink/55">Free — takes a minute.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => update("role", r.key)}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  form.role === r.key
                    ? "border-forest bg-forest-50"
                    : "border-black/10 hover:border-forest/40"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-forest">
                  <r.icon className="h-5 w-5" />
                </span>
                <p className="mt-2 text-sm font-bold text-ink">{r.title}</p>
                <p className="mt-0.5 text-xs text-ink/55">{r.text}</p>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="first_name">
                  First name
                </label>
                <input
                  id="first_name"
                  className="input"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  className="input"
                  value={form.username}
                  autoComplete="username"
                  onChange={(e) => update("username", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                autoComplete="email"
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={form.password}
                autoComplete="new-password"
                onChange={(e) => update("password", e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-ink/40">
                At least 8 characters, not all numeric.
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
