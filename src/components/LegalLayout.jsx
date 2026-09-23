import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo.jsx";
import { config } from "../config/artisan.js";

/* Mise en page commune aux pages légales : titre collant à gauche,
   sections numérotées à droite. */
export default function LegalLayout({ tag, title, sections }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b-2 border-ink">
        <div className="wrap flex items-center justify-between" style={{ height: "var(--header-h)" }}>
          <Logo />
          <Link to="/" className="btn-line !px-4 !py-2 text-sm">
            <ArrowLeft size={16} /> Retour au site
          </Link>
        </div>
      </header>

      <main className="wrap grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-12">
            <div className="section-tag text-brand-text">{tag}</div>
            <h1 className="h-section mt-5">{title}</h1>
            <p className="label mt-6 text-ink/50">{config.nomEntreprise} · mise à jour {new Date().getFullYear()}</p>
          </div>
        </div>
        <div className="border-t-2 border-ink lg:col-span-7">
          {sections.map((s, i) => (
            <section key={s.title} className="grid gap-3 border-b-2 border-ink py-8 sm:grid-cols-[4rem_1fr]">
              <span className="label pt-1.5 text-brand-text">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="h-display text-3xl">{s.title}</h2>
                <div className="mt-3 text-lg leading-relaxed text-ink/70">{s.body}</div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="bg-ink py-6 text-sm text-paper/55">
        <div className="wrap">
          © {new Date().getFullYear()} {config.nomEntreprise} · SIREN {config.siren}
        </div>
      </footer>
    </div>
  );
}
