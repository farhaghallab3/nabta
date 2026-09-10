import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/api";
import { Leaf, Sprout, Home } from "../components/Icons";

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const roles = [
    { key: "consumer", title: t("auth.consumerRole"), text: t("auth.consumerRoleText"), icon: Home },
    { key: "farmer", title: t("auth.farmerRole"), text: t("auth.farmerRoleText"), icon: Sprout },
  ];

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
      const user = await register({ ...form, username: form.username.trim() });
      navigate(user.role === "farmer" ? "/farmer" : "/my-adoptions", {
        replace: true,
      });
    } catch (err) {
      setError(apiErrorMessage(err, t("auth.createError")));
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
          <span className="text-xl font-extrabold text-ink">{t("brand.name")}</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink">{t("auth.createTitle")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("auth.createSubtitle")}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => update("role", r.key)}
                className={`rounded-xl border-2 p-4 text-start transition-all ${
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
                  {t("auth.firstName")}
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
                  {t("auth.username")}
                </label>
                <input
                  id="username"
                  className="input"
                  value={form.username}
                  autoComplete="username"
                  dir="ltr"
                  onChange={(e) => update("username", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="email">
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                autoComplete="email"
                dir="ltr"
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={form.password}
                autoComplete="new-password"
                dir="ltr"
                onChange={(e) => update("password", e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-ink/40">{t("auth.passwordHint")}</p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t("auth.creating") : t("auth.createButton")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              {t("auth.loginButton")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
