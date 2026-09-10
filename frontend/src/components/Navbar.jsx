import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Leaf } from "./Icons";
import { LanguageToggle } from "./LanguageToggle";

function Brand() {
  const { t } = useTranslation();
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-white">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-ink">
        {t("brand.name")}
      </span>
    </Link>
  );
}

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-forest" : "text-ink/60 hover:text-ink"
  }`;

export function Navbar() {
  const { t } = useTranslation();
  const { user, logout, isFarmer } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const dashboardLink = isFarmer
    ? { to: "/farmer", label: t("nav.farmerDashboard") }
    : { to: "/my-adoptions", label: t("nav.myAdoptions") };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <Brand />

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/batches" className={linkClass}>
            {t("nav.browse")}
          </NavLink>
          <NavLink to="/for-farmers" className={linkClass}>
            {t("nav.forFarmers")}
          </NavLink>
          {user && (
            <NavLink to={dashboardLink.to} className={linkClass}>
              {dashboardLink.label}
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle className="py-1.5" />
          {user ? (
            <>
              <span className="text-sm text-ink/55">
                {t("nav.greeting", { name: user.username })}
              </span>
              <button onClick={handleLogout} className="btn-secondary py-2">
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost py-2">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="btn-primary py-2">
                {t("nav.getStarted")}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle className="py-1.5" />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu")}
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-cream px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/batches" className={linkClass} onClick={() => setOpen(false)}>
              {t("nav.browse")}
            </NavLink>
            <NavLink
              to="/for-farmers"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t("nav.forFarmers")}
            </NavLink>
            {user && (
              <NavLink
                to={dashboardLink.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {dashboardLink.label}
              </NavLink>
            )}
            <div className="mt-2 flex gap-3">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary flex-1 py-2">
                  {t("nav.logout")}
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-secondary flex-1 py-2"
                    onClick={() => setOpen(false)}
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary flex-1 py-2"
                    onClick={() => setOpen(false)}
                  >
                    {t("nav.getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
