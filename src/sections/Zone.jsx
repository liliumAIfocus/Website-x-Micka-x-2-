import { Check } from "lucide-react";
import { config } from "../config/artisan.js";

/* Carte « radar » de la zone d'intervention : la ville de référence au
   centre, le rayon en km, et les communes desservies placées autour. */
function RadarMap() {
  const communes = config.communes || [];
  // Commune = objet { nom, x, y, pos } : position choisie à la main (repère
  // 500 × 500, centre 250/250, cercle de rayon 210 ; pos = nom au-dessus
  // "top" ou en dessous "bottom" du point).
  // Commune = simple texte : position déterministe autour du centre (angle
  // réparti + distance variable).
  const points = communes.map((c, i) => {
    if (typeof c === "object") return { name: c.nom, x: c.x, y: c.y, pos: c.pos || "bottom" };
    const angle = (i / communes.length) * Math.PI * 2 - Math.PI / 2 + 0.35;
    const dist = 95 + ((i * 47) % 3) * 38;
    const y = 250 + Math.sin(angle) * dist;
    return { name: c, x: 250 + Math.cos(angle) * dist, y, pos: y > 250 ? "bottom" : "top" };
  });

  return (
    <svg viewBox="0 0 500 500" className="h-auto w-full" role="img" aria-label={`Zone d'intervention : ${config.rayonKm} km autour de ${config.villeProche}`}>
      {/* Quadrillage */}
      <defs>
        <pattern id="zone-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" fill="none" stroke="rgb(var(--ink-rgb) / 0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="500" height="500" fill="url(#zone-grid)" />

      {/* Anneaux */}
      {[70, 140, 210].map((r) => (
        <circle key={r} cx="250" cy="250" r={r} fill="none" stroke="rgb(var(--ink-rgb) / 0.25)" strokeWidth="1.5" strokeDasharray="4 6" />
      ))}
      <circle cx="250" cy="250" r="210" fill="rgb(var(--brand-rgb) / 0.08)" stroke="rgb(var(--ink-rgb))" strokeWidth="2.5" />
      <circle className="radar-ring" cx="250" cy="250" r="210" fill="rgb(var(--brand-rgb) / 0.18)" />

      {/* Axes */}
      <path d="M250 30V470M30 250H470" stroke="rgb(var(--ink-rgb) / 0.2)" strokeWidth="1" />

      {/* Libellé du rayon */}
      <g transform="translate(250 40)">
        <rect x="-44" y="-14" width="88" height="28" fill="rgb(var(--ink-rgb))" />
        <text textAnchor="middle" y="5" fill="rgb(var(--paper-rgb))" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600 }}>
          {config.rayonKm} KM
        </text>
      </g>

      {/* Communes */}
      {points.map((p) => (
        <g key={p.name}>
          <rect x={p.x - 4} y={p.y - 4} width="8" height="8" fill="rgb(var(--ink-rgb))" />
          <text
            x={p.x}
            y={p.y + (p.pos === "bottom" ? 22 : -12)}
            textAnchor="middle"
            fill="rgb(var(--ink-rgb) / 0.8)"
            // Détourage clair : les anneaux et axes ne coupent pas le nom
            stroke="rgb(var(--paper-rgb))"
            strokeWidth="4"
            strokeLinejoin="round"
            paintOrder="stroke"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 14, fontWeight: 600 }}
          >
            {p.name}
          </text>
        </g>
      ))}

      {/* Centre */}
      <circle cx="250" cy="250" r="16" fill="rgb(var(--brand-rgb))" stroke="rgb(var(--ink-rgb))" strokeWidth="3" />
      <circle cx="250" cy="250" r="5" fill="rgb(var(--ink-rgb))" />
      <g transform="translate(250 290)">
        <rect x={-(config.villeProche.length * 5.6 + 18)} y="-15" width={config.villeProche.length * 11.2 + 36} height="30" fill="rgb(var(--brand-rgb))" stroke="rgb(var(--ink-rgb))" strokeWidth="2" />
        <text textAnchor="middle" y="6" fill="rgb(var(--on-brand-rgb))" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 800 }}>
          {config.villeProche}
        </text>
      </g>
    </svg>
  );
}

const ENGAGEMENTS = [
  config.assurance,
  "Devis gratuit et détaillé",
  "Chantier protégé, laissé propre",
  `Artisan local, à ${config.rayonKm} km max`,
];

export default function Zone() {
  return (
    <section id="engagements" className="relative border-y-2 border-ink bg-paper-2 py-20 lg:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <div data-reveal className="section-tag text-brand-text">(05) — Engagements & zone</div>
          <h2 data-reveal className="h-section mt-5" style={{ "--d": "80ms" }}>
            Des engagements écrits, pas des promesses.
          </h2>
          <ul className="mt-10 border-t-2 border-ink">
            {ENGAGEMENTS.map((title, i) => (
              <li
                key={title}
                data-reveal
                style={{ "--d": `${i * 70}ms` }}
                className="grid grid-cols-[auto_1fr] items-center gap-4 border-b-2 border-ink py-5"
              >
                <span className="grid h-7 w-7 place-items-center bg-ink text-paper">
                  <Check size={16} strokeWidth={3} />
                </span>
                <h3 className="font-display text-xl font-bold leading-tight">{title}</h3>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="lg:col-span-6" style={{ "--d": "120ms" }}>
          <div className="relative mx-auto max-w-[560px] border-2 border-ink bg-paper shadow-hard">
            <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5">
              <span className="label text-ink/70">Zone d'intervention</span>
              <span className="label text-brand-text">{config.zoneIntervention}</span>
            </div>
            <RadarMap />
          </div>
        </div>
      </div>
    </section>
  );
}
