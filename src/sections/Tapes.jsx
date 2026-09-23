import { config } from "../config/artisan.js";

/* Deux bandes « ruban de chantier » qui se croisent et défilent en sens
   opposés : les prestations sur l'une, les engagements sur l'autre. */
function Tape({ items, className = "", speed = "45s", reverse = false, rotate = 0 }) {
  // Deux moitiés identiques pour une boucle sans couture (translateX -50 %),
  // chacune assez longue pour couvrir les grands écrans.
  const loop = [...items, ...items];
  return (
    <div
      className={`absolute left-[-5%] w-[110%] overflow-hidden border-y-2 border-ink ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className={`marquee ${reverse ? "reverse" : ""}`} style={{ "--speed": speed }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {loop.map((item, i) => (
              <span key={i} className="flex items-center">
                <span
                  className="h-display whitespace-nowrap px-6 py-3 text-[1.7rem] uppercase sm:text-[2.1rem]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {item}
                </span>
                <span className="text-2xl opacity-70">✱</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Tapes() {
  const services = config.services.map((s) => s.title);
  const engagements = [
    "Devis gratuit",
    "Garantie décennale",
    `${config.rayonKm} km autour de ${config.villeProche}`,
    `${config.noteSurCinq} sur Google`,
    "Chantier propre",
  ];
  return (
    <section aria-label="Prestations et engagements" className="relative h-44 overflow-hidden sm:h-52">
      <Tape
        items={engagements}
        className="top-[42%] bg-brand text-brand-on"
        rotate={2.2}
        speed="55s"
        reverse
      />
      <Tape items={services} className="top-[22%] bg-ink text-paper" rotate={-2.5} speed="45s" />
    </section>
  );
}
