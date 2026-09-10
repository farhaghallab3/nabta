import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-extrabold text-forest">404</p>
      <h1 className="mt-3 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-ink/55">
        That page has been harvested and shipped elsewhere.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back home
      </Link>
    </div>
  );
}
