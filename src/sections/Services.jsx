import { ArrowUpRight } from "lucide-react";
import { config } from "../config/artisan.js";
import { ICONS } from "../lib/icons.jsx";

/* Prestations en liste d'index numérotée (façon sommaire de catalogue).
   Chaque ligne ouvre le simulateur de devis. */
export default function Services({ onOpenSimulator }) {
  return (
    <section id="prestations" className="relative pb-20 pt-10 lg:pb-28 lg:pt-14">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div data-reveal className="section-tag text-brand-text">(01) — Prestations</div>
            <h2 data-reveal className="h-section mt-5" style={{ "--d": "80ms" }}>
              Un seul artisan
              <br />
              pour tout le logement.
            </h2>
          </div>
          <p data-reveal className="max-w-md text-lg text-ink/70 lg:col-span-5 lg:justify-self-end" style={{ "--d": "160ms" }}>
            De la fuite du dimanche à la salle de bain complète : un interlocuteur
            unique, qui connaît votre installation.
          </p>
        </div>

        <ul className="mt-14 border-t-2 border-ink">
          {config.services.map((s, i) => {
            const Icon = ICONS[s.icon] || ICONS.Wrench;
            return (
              <li key={s.title} data-reveal style={{ "--d": `${i * 60}ms` }}>
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="group relative grid w-full grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-2 border-b-2 border-ink px-1 py-6 text-left transition-colors duration-300 hover:bg-ink hover:text-paper sm:gap-x-6 sm:px-4 md:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:items-center md:py-7"
                >
                  <span className="label pt-2 text-brand-text transition-colors group-hover:text-brand-bright md:pt-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-4">
                    <Icon
                      size={26}
                      strokeWidth={1.8}
                      className="hidden shrink-0 text-ink/40 transition-colors group-hover:text-brand-bright sm:block"
                    />
                    <span className="h-display text-[1.9rem] leading-none sm:text-4xl lg:text-[2.75rem]">
                      {s.title}
                    </span>
                  </span>
                  <span className="col-span-2 col-start-2 row-start-2 text-[15px] leading-relaxed text-ink/65 transition-colors group-hover:text-paper/75 md:col-span-1 md:col-start-3 md:row-start-1">
                    {s.desc}
                  </span>
                  <span className="col-start-3 row-start-1 grid h-11 w-11 place-items-center border-2 border-current transition-all duration-300 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-on md:col-start-4">
                    <ArrowUpRight size={20} strokeWidth={2.2} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div data-reveal className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="label text-ink/55">
            Intervention dans un rayon de {config.rayonKm} km autour de {config.villeProche}
          </p>
          <button type="button" onClick={onOpenSimulator} className="btn-line">
            Décrire mon besoin <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
