import { Link } from "react-router-dom";
import { config } from "../config/artisan.js";
import { MARK, TEXTE } from "./logoPaths.js";

/* Logo MG Works en vectoriel : il prend la couleur du texte autour
   (currentColor), donc marine sur fond clair et blanc sur fond sombre. */
function Trace({ trace, height, className = "" }) {
  return (
    <svg
      viewBox={`0 0 ${trace.w} ${trace.h}`}
      height={height}
      width={(height * trace.w) / trace.h}
      className={`shrink-0 ${className}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path fillRule="evenodd" d={trace.d} />
    </svg>
  );
}

/* Le monogramme « MG » seul (barre du simulateur, etc.) */
export function Monogram({ size = 44, dark = true }) {
  return <Trace trace={MARK} height={size * 0.6} className={dark ? "text-ink" : "text-paper"} />;
}

export default function Logo({ dark = true, sub = true, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`group flex items-center gap-3 ${dark ? "text-ink" : "text-paper"}`}
      aria-label={config.nomEntreprise}
    >
      <Trace trace={MARK} height={30} />
      <span className={`flex flex-col border-l pl-3 ${dark ? "border-ink/25" : "border-paper/30"}`}>
        <Trace trace={TEXTE} height={11} />
        {sub && (
          <span className={`label mt-1.5 hidden text-[10px] sm:block ${dark ? "text-ink/55" : "text-paper/55"}`}>
            Artisan · {config.ville}
          </span>
        )}
      </span>
    </Link>
  );
}
