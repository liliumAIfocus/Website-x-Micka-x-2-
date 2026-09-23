import { ArrowUpRight, Phone } from "lucide-react";
import { config } from "../config/artisan.js";
import { useScrolled } from "../lib/hooks.js";

/* Barre d'action fixe en bas d'écran (mobile uniquement) : appeler ou
   demander un devis, toujours à portée de pouce. Apparaît après le hero. */
export default function MobileBar({ onOpenSimulator, hidden }) {
  const scrolled = useScrolled(520);
  const show = scrolled && !hidden;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t-2 border-ink bg-ink transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      inert={!show}
    >
      <a
        href={`tel:${config.telLien}`}
        className="flex items-center justify-center gap-2 bg-ink py-4 font-display text-[15px] font-bold text-paper"
      >
        <Phone size={18} strokeWidth={2.4} /> Appeler
      </a>
      <button
        type="button"
        onClick={onOpenSimulator}
        className="flex items-center justify-center gap-2 bg-brand py-4 font-display text-[15px] font-bold text-brand-on"
      >
        Devis gratuit <ArrowUpRight size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}
