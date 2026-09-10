import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/api";
import { Leaf } from "../components/Icons";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(form.username.trim(), form.password);
      navigate(
        from !== "/" ? from : user.role === "farmer" ? "/farmer" : "/my-adoptions",
        { replace: true }
      );
    } catch (err) {
      setError(apiErrorMessage(err, t("auth.invalidCreds")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold text-ink">{t("brand.name")}</span>
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink">{t("auth.welcomeBack")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("auth.loginSubtitle")}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
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
                onChange={(e) => setForm({ ...form, username: e.target.value })}
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
                autoComplete="current-password"
                dir="ltr"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t("auth.signingIn") : t("auth.loginButton")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            {t("auth.newHere")}{" "}
            <Link to="/register" className="font-semibold text-forest hover:underline">
              {t("auth.createAccountLink")}
            </Link>
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-forest-50 p-4 text-xs text-forest-900/70">
          <p className="font-semibold text-forest-900">{t("auth.demoLogins")}</p>
          <p className="mt-1" dir="ltr">
            {t("auth.demoLoginsText")}
          </p>
        </div>
      </div>
    </div>
  );
}
