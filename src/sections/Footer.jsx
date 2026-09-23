import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { config } from "../config/artisan.js";
import { useFitText } from "../lib/hooks.js";
import { smoothScrollTo, onAnchorClick } from "../lib/scroll.js";
import { NAV_LINKS } from "../lib/nav.js";

export default function Footer() {
  const fitRef = useFitText();
  return (
    <footer className="relative overflow-hidden bg-ink pb-24 text-paper md:pb-0">
      <div className="wrap">
        <div className="grid gap-10 border-t-2 border-paper/15 pt-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark={false} />
            <p className="mt-5 max-w-sm text-paper/60">
              {config.metierLignes}. Artisan basé à {config.ville}, intervient dans un
              rayon de {config.rayonKm} km.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="label mb-4 text-paper/45">Le site</div>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => onAnchorClick(e, l.href)}
                    className="text-paper/75 transition-colors hover:text-brand-bright"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="label mb-4 text-paper/45">Prestations</div>
            <ul className="space-y-2.5 text-paper/75">
              {config.services.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="label mb-4 text-paper/45">Contact</div>
            <ul className="space-y-2.5 text-paper/75">
              <li>
                <a href={`tel:${config.telLien}`} className="font-display text-lg font-bold text-paper hover:text-brand-bright">
                  {config.tel}
                </a>
              </li>
              <li>
                <a href={`mailto:${config.email}`} className="break-all hover:text-brand-bright">
                  {config.email}
                </a>
              </li>
              <li>
                {config.ville} · {config.codePostal}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/15 py-6 text-sm text-paper/45 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {config.nomEntreprise} · SIREN {config.siren} · {config.assurance}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/mentions-legales" className="hover:text-paper">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="hover:text-paper">
              Confidentialité
            </Link>
            <button
              type="button"
              onClick={() => smoothScrollTo(0, 1000)}
              className="grid h-10 w-10 place-items-center border-2 border-paper/30 text-paper transition-colors hover:border-brand hover:bg-brand hover:text-brand-on"
              aria-label="Revenir en haut"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Nom géant, ajusté à la largeur */}
      <div className="wrap overflow-hidden" aria-hidden="true">
        <div
          ref={fitRef}
          className="h-display w-max whitespace-nowrap text-brand-bright"
          style={{ lineHeight: 0.78, marginBottom: "-0.1em" }}
        >
          {config.nomEntreprise}
        </div>
      </div>
    </footer>
  );
}
