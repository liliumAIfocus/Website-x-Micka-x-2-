import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { config } from "../config/artisan.js";
import { GoogleG, Stars } from "../lib/icons.jsx";
import { useSwipe } from "../lib/hooks.js";

const REVIEWS = config.avis;
const DURATION = 7000;
// "25+" (palier) → "plus de 25 avis" ; 24 → "24 avis"
const NB_AVIS = String(config.nbAvis).endsWith("+")
  ? `plus de ${parseInt(config.nbAvis, 10)} avis`
  : `${config.nbAvis} avis`;

/* Avis : un seul avis à la fois, en très grand, qui défile automatiquement
   (barre de progression) — flèches, puces et glisser sur mobile. */
export default function Avis() {
  const n = REVIEWS.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (dir) => setIndex((i) => (i + dir + n) % n);
  const swipe = useSwipe((dir) => {
    setPaused(true);
    go(dir);
  });

  useEffect(() => {
    if (paused || n < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % n), DURATION);
    return () => clearTimeout(id);
  }, [index, paused, n]);

  const r = REVIEWS[index];

  return (
    <section id="avis" className="relative py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-12">
        {/* Note globale */}
        <div className="lg:col-span-4">
          <div data-reveal className="section-tag text-brand-text">(06) — Avis clients</div>
          <div data-reveal className="mt-8 border-2 border-ink bg-paper shadow-hard" style={{ "--d": "80ms" }}>
            <div className="flex items-center gap-2 border-b-2 border-ink px-5 py-3">
              <GoogleG size={18} />
              <span className="label text-ink/70">Avis Google vérifiés</span>
            </div>
            <div className="px-5 py-6">
              <div className="h-display text-[6.5rem] leading-none">{config.noteGoogle}</div>
              <Stars size={22} className="mt-3 text-brand" />
              <p className="mt-3 text-ink/65">
                Note moyenne sur <strong className="text-ink">{NB_AVIS}</strong>
              </p>
            </div>
            {config.lienAvisGoogle && (
              <a
                href={config.lienAvisGoogle}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border-t-2 border-ink px-5 py-3.5 font-display font-bold transition-colors hover:bg-ink hover:text-paper"
              >
                Voir tous les avis <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Avis en grand */}
        <div
          className="flex flex-col lg:col-span-8 lg:pl-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => {
            setPaused(true);
            swipe.onTouchStart(e);
          }}
          onTouchEnd={swipe.onTouchEnd}
        >
          <div data-reveal className="flex items-center justify-between" style={{ "--d": "120ms" }}>
            <span className="h-display text-[6rem] leading-[0.6] text-brand" aria-hidden="true">
              “
            </span>
            <span className="font-mono text-sm tabular-nums text-ink/60">
              <span className="text-lg font-semibold text-ink">{String(index + 1).padStart(2, "0")}</span>
              {" / "}
              {String(n).padStart(2, "0")}
            </span>
          </div>

          <figure key={index} className="fade-up mt-4 flex-1" aria-live="polite">
            <blockquote className="font-display text-[1.65rem] font-bold leading-[1.2] tracking-tight sm:text-[2.2rem] lg:text-[2.6rem]">
              {r.text}
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-4">
              <span className="grid h-12 w-12 place-items-center bg-ink font-display text-xl font-extrabold text-paper">
                {r.initial}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-lg font-bold">{r.name}</span>
                <span className="text-sm text-ink/60">
                  {r.visited} · {r.when}
                </span>
              </span>
              <Stars size={16} className="ml-auto text-brand" />
            </figcaption>
          </figure>

          {/* Navigation */}
          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                go(-1);
              }}
              className="grid h-12 w-12 place-items-center border-2 border-ink transition-colors hover:bg-ink hover:text-paper"
              aria-label="Avis précédent"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                go(1);
              }}
              className="grid h-12 w-12 place-items-center border-2 border-ink transition-colors hover:bg-ink hover:text-paper"
              aria-label="Avis suivant"
            >
              <ArrowRight size={20} />
            </button>
            <div className="flex flex-1 gap-2">
              {REVIEWS.map((rv, i) => (
                <button
                  key={rv.name}
                  type="button"
                  onClick={() => {
                    setPaused(true);
                    setIndex(i);
                  }}
                  aria-label={`Voir l'avis ${i + 1}`}
                  className="relative h-3 flex-1 py-1"
                >
                  <span className="block h-[3px] w-full overflow-hidden bg-ink/15">
                    {i < index && <span className="block h-full w-full bg-ink" />}
                    {i === index && (
                      <span
                        key={`${index}-${paused}`}
                        className={`block h-full w-full bg-brand ${paused ? "" : "progress-run"}`}
                        style={{ "--dur": `${DURATION}ms` }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
