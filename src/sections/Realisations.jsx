import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { config } from "../config/artisan.js";

gsap.registerPlugin(ScrollTrigger);

const CHANTIERS = config.chantiers;

/* Réalisations : sur ordinateur, la section s'épingle et la galerie défile
   horizontalement au scroll. Sur mobile/tablette : carrousel natif (glisser). */
export default function Realisations({ onOpenSimulator }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const [current, setCurrent] = useState(1);
  const n = CHANTIERS.length;

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            setCurrent(Math.min(n, Math.floor(self.progress * n) + 1));
          },
        },
      });
    });
    return () => mm.revert();
  }, [n]);

  return (
    <section
      id="realisations"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-20 text-paper lg:flex lg:h-screen lg:flex-col lg:py-0"
    >
      <div className="wrap lg:pt-[calc(var(--header-h)+2.5rem)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-reveal className="section-tag text-brand-bright">(03) — Réalisations</div>
            <h2 data-reveal className="h-section mt-5" style={{ "--d": "80ms" }}>
              Le travail, <span className="text-brand-bright">sur pièce.</span>
            </h2>
          </div>
          <div data-reveal className="flex items-end gap-6" style={{ "--d": "160ms" }}>
            <p className="max-w-xs text-paper/65">
              Salles de bain, douches, réseaux : quelques chantiers récents, livrés
              propres.
            </p>
            <div className="hidden font-mono text-sm tabular-nums text-paper/70 lg:block">
              <span className="text-2xl font-semibold text-paper">{String(current).padStart(2, "0")}</span>
              {" / "}
              {String(n).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* Piste de la galerie */}
      <div className="mt-12 lg:mt-10 lg:flex-1 lg:overflow-hidden">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:h-full lg:snap-none lg:items-start lg:gap-8 lg:overflow-visible lg:px-10 lg:will-change-transform"
        >
          {CHANTIERS.map((c, i) => (
            <figure key={c.src} className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto">
              <div
                className={`relative overflow-hidden border-2 border-paper/15 bg-ink-2 ${
                  i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                } lg:h-[calc(100vh-var(--header-h)-24rem)] lg:min-h-[300px]`}
              >
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="label absolute left-0 top-0 bg-paper px-2.5 py-1.5 text-ink">
                  Fig. {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <figcaption className="mt-3 max-w-[22rem] text-sm leading-snug text-paper/70">{c.alt}</figcaption>
            </figure>
          ))}

          {/* Dernière « carte » : appel à l'action */}
          <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-between border-2 border-brand bg-brand p-6 text-brand-on sm:w-[46vw] lg:h-[calc(100vh-var(--header-h)-24rem)] lg:min-h-[300px] lg:w-[26rem] lg:p-8">
            <span className="label opacity-80">Fig. {String(n + 1).padStart(2, "0")} — la vôtre ?</span>
            <div>
              <p className="h-display text-4xl lg:text-5xl">Votre chantier, prochain sur la liste.</p>
              <button
                type="button"
                onClick={onOpenSimulator}
                className="btn mt-8 bg-ink px-5 py-3 text-paper hover:bg-ink-2"
              >
                Estimer mon projet <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progression (ordinateur) / indication de glisser (mobile) */}
      <div className="wrap mt-6 lg:mb-8">
        <div className="hidden h-[3px] w-full bg-paper/15 lg:block">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-brand-bright" />
        </div>
        <p className="label flex items-center gap-2 text-paper/50 lg:hidden">
          Glissez pour voir la suite <ArrowRight size={14} />
        </p>
      </div>
    </section>
  );
}
