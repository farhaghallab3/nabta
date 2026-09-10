import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/api";
import { Leaf } from "../components/Icons";

export default function Login() {
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
      setError(apiErrorMessage(err, "Invalid username or password."));
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
          <span className="text-xl font-extrabold text-ink">Nabta</span>
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/55">
            Log in to follow your batches.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="input"
                value={form.username}
                autoComplete="username"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
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
                autoComplete="current-password"
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
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            New here?{" "}
            <Link to="/register" className="font-semibold text-forest hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-forest-50 p-4 text-xs text-forest-900/70">
          <p className="font-semibold text-forest-900">Demo logins</p>
          <p className="mt-1">consumer / nabtademo123 — farmer / nabtademo123</p>
        </div>
      </div>
    </div>
  );
}
