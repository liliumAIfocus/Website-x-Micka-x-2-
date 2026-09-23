import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { config } from "../config/artisan.js";

gsap.registerPlugin(ScrollTrigger);

const prenom = config.nomGerant.split(" ")[0];

const STEPS = [
  {
    title: "Premier contact",
    note: "Rappel sous 24 h",
    desc: `Vous appelez ou remplissez le simulateur. ${prenom} vous rappelle pour comprendre votre besoin et, si c'est urgent, intervient au plus vite.`,
  },
  {
    title: "Visite & diagnostic",
    note: "Sans engagement",
    desc: "Sur place, on regarde l'existant ensemble : état des réseaux, contraintes du logement, vos envies. Des conseils clairs, sans jargon.",
  },
  {
    title: "Devis détaillé",
    note: "Sous quelques jours",
    desc: "Matériaux, main d'œuvre, planning : tout est écrit noir sur blanc. Le prix annoncé est le prix payé.",
  },
  {
    title: "Chantier & finitions",
    note: config.assurance,
    desc: "Logement protégé, chantier nettoyé chaque soir, finitions vérifiées avec vous avant de partir. Les travaux sont couverts par la garantie décennale.",
  },
];

/* Hexagone façon écrou/raccord, pour les étapes */
const HEX = "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)";

/* Méthode : un « tuyau » se remplit au fil du scroll et relie les
   étapes, chaque raccord s'allume au passage. */
export default function Methode({ onOpenSimulator }) {
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const pipeRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const pipe = pipeRef.current;
    // Le tuyau va du centre du 1er raccord au centre du dernier
    const size = () => {
      const steps = list.querySelectorAll("[data-step]");
      pipe.style.height = `${steps[steps.length - 1].offsetTop}px`;
    };
    size();
    const ro = new ResizeObserver(() => {
      size();
      ScrollTrigger.refresh();
    });
    ro.observe(list);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: pipe, start: "top 62%", end: "bottom 62%", scrub: 0.3 },
        }
      );
      list.querySelectorAll("[data-step]").forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top+=28 62%",
          toggleClass: { targets: step, className: "is-active" },
        });
      });
    }, rootRef);
    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section id="methode" ref={rootRef} className="relative py-20 lg:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky" style={{ top: "calc(var(--header-h) + 3rem)" }}>
            <div data-reveal className="section-tag text-brand-text">(04) — La méthode</div>
            <h2 data-reveal className="h-section mt-5" style={{ "--d": "80ms" }}>
              Du premier appel à la dernière finition.
            </h2>
            <p data-reveal className="mt-6 max-w-md text-lg text-ink/70" style={{ "--d": "140ms" }}>
              Quatre étapes, les mêmes à chaque fois. Vous savez toujours où en est
              votre chantier — et ce qu'il va coûter.
            </p>
            <button
              data-reveal
              type="button"
              onClick={onOpenSimulator}
              className="btn-main mt-9"
              style={{ "--d": "200ms" }}
            >
              Commencer par l'étape 1
              <span className="btn-arrow">
                <ArrowUpRight size={22} strokeWidth={2.4} />
              </span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ol ref={listRef} className="relative">
            {/* Tuyau : gaine + remplissage couleur de marque (dégradé = effet cylindre) */}
            <div
              ref={pipeRef}
              aria-hidden="true"
              className="absolute left-[22px] top-7 w-3 border-2 border-ink bg-paper-3 sm:left-[26px] sm:top-8"
            >
              <div
                ref={fillRef}
                className="h-full w-full origin-top"
                style={{
                  background:
                    "linear-gradient(90deg, var(--brand-deep) 0%, var(--brand-light) 35%, var(--brand) 60%, var(--brand-deep) 100%)",
                }}
              />
            </div>

            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-step
                className="group relative grid grid-cols-[56px_1fr] gap-5 pb-14 last:pb-0 sm:grid-cols-[64px_1fr] sm:gap-8 sm:pb-20"
              >
                {/* Raccord hexagonal */}
                <div className="relative h-14 w-14 sm:h-16 sm:w-16">
                  <div className="absolute inset-0 bg-ink" style={{ clipPath: HEX }} />
                  <div
                    className="absolute inset-[3px] grid place-items-center bg-paper font-mono text-sm font-semibold transition-colors duration-500 group-[.is-active]:bg-brand group-[.is-active]:text-brand-on"
                    style={{ clipPath: HEX }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="pt-1 transition-opacity duration-500 sm:pt-2 lg:opacity-40 lg:group-[.is-active]:opacity-100">
                  <span className="label inline-block border border-ink/30 px-2 py-1 text-[10px] text-ink/70">
                    {s.note}
                  </span>
                  <h3 className="h-display mt-4 text-4xl sm:text-5xl">{s.title}</h3>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
