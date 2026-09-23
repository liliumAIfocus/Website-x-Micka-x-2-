import { Link } from "react-router-dom";
import { config } from "../config/artisan.js";

/* Initiales du logo : config.monogramme, sinon 1re lettre des deux premiers
   mots du nom ("Duval Plomberie" → "DP"). */
const MONOGRAMME =
  config.monogramme ||
  config.nomEntreprise
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export function Monogram({ size = 44, dark = true }) {
  return (
    <span
      className={`grid shrink-0 place-items-center font-display font-extrabold leading-none ${
        dark ? "bg-ink text-paper" : "bg-paper text-ink"
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        fontVariationSettings: '"wdth" 75',
        boxShadow: "inset 0 -4px 0 0 rgb(var(--brand-rgb))",
      }}
      aria-hidden="true"
    >
      {MONOGRAMME}
    </span>
  );
}

export default function Logo({ dark = true, sub = true, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="group flex items-center gap-3">
      <Monogram dark={dark} />
      <span className="flex flex-col">
        <span
          className={`font-display text-lg font-extrabold leading-none tracking-tight ${
            dark ? "text-ink" : "text-paper"
          }`}
          style={{ fontVariationSettings: '"wdth" 85' }}
        >
          {config.nomEntreprise}
        </span>
        {sub && (
          <span
            className={`label mt-1 hidden text-[10px] sm:block ${
              dark ? "text-ink/55" : "text-paper/55"
            }`}
          >
            Artisan · {config.ville}
          </span>
        )}
      </span>
    </Link>
  );
}
