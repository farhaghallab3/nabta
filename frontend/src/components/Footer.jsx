import { Link } from "react-router-dom";
import { Leaf } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold text-ink">Nabta</span>
          </div>
          <p className="mt-3 text-sm text-ink/55">
            From the field to your door — fully transparent. Adopt a share of a
            real Egyptian farm and follow every step.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/55">
            <li>
              <Link to="/batches" className="hover:text-forest">
                Browse Batches
              </Link>
            </li>
            <li>
              <Link to="/for-farmers" className="hover:text-forest">
                For Farmers
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-forest">
                Create account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/55">
            <li>About</li>
            <li>Impact report</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Built by</h4>
          <p className="mt-3 text-sm text-ink/55">
            A portfolio project by the Nabta team — Django, DRF, React &amp;
            Tailwind. Connecting Egyptian farms directly to households.
          </p>
        </div>
      </div>
      <div className="border-t border-black/5 py-6">
        <p className="container-page text-xs text-ink/40">
          © {new Date().getFullYear()} Nabta. Demo project — not a commercial
          service.
        </p>
      </div>
    </footer>
  );
}
