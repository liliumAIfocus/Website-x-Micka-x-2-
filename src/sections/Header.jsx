import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { config } from "../config/artisan.js";
import { useOpenStatus, useScrolled } from "../lib/hooks.js";
import { onAnchorClick } from "../lib/scroll.js";
import { NAV_LINKS } from "../lib/nav.js";

export function StatusDot({ open, className = "" }) {
  return (
    <span
      className={`pulse-dot inline-block h-2 w-2 shrink-0 rounded-full ${
        open ? "text-emerald-600" : "text-brand"
      } ${className}`}
      style={{ background: "currentColor" }}
    />
  );
}

export default function Header({ onOpenSimulator }) {
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);
  const status = useOpenStatus(config.horaires, config.urgence24h);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b-2 transition-colors duration-300 ${
          scrolled ? "border-ink bg-paper" : "border-transparent bg-paper/0"
        }`}
        style={{ height: "var(--header-h)" }}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Navigation principale">
            {NAV_LINKS.slice(0, 5).map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => onAnchorClick(e, l.href)}
                className="group relative py-1 font-display text-[15px] font-semibold text-ink/80 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={`tel:${config.telLien}`}
              className="hidden items-center gap-3 md:flex"
              aria-label={`Appeler ${config.nomEntreprise} au ${config.tel}`}
            >
              <span className="flex flex-col items-end leading-tight">
                <span className="label flex items-center gap-2 text-[10px] text-ink/60">
                  <StatusDot open={status.open} />
                  {status.label}
                </span>
                <span
                  className="font-display text-lg font-extrabold tracking-tight"
                  style={{ fontVariationSettings: '"wdth" 85' }}
                >
                  {config.tel}
                </span>
              </span>
            </a>
            <button
              type="button"
              onClick={onOpenSimulator}
              className="btn-brand hidden !px-4 !py-2.5 text-sm md:inline-flex"
            >
              Devis gratuit <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>

            {/* Mobile : appel direct + menu */}
            <a
              href={`tel:${config.telLien}`}
              className="grid h-11 w-11 place-items-center bg-brand text-brand-on md:hidden"
              aria-label={`Appeler ${config.nomEntreprise}`}
            >
              <Phone size={19} strokeWidth={2.4} />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center bg-ink text-paper xl:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu plein écran */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-ink text-paper transition-[clip-path] duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        inert={!open}
      >
        <div className="wrap flex items-center justify-between" style={{ height: "var(--header-h)" }}>
          <Logo dark={false} onClick={() => setOpen(false)} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center bg-paper text-ink"
            aria-label="Fermer le menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="wrap mt-6 flex flex-1 flex-col overflow-y-auto" aria-label="Menu mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => onAnchorClick(e, l.href, () => setOpen(false))}
              className="group flex items-baseline gap-4 border-b border-paper/15 py-4"
              style={{
                transition: "opacity .5s, transform .5s",
                transitionDelay: open ? `${150 + i * 50}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(20px)",
              }}
            >
              <span className="label text-brand-bright">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-display text-[2.6rem] transition-colors group-hover:text-brand-bright sm:text-6xl">
                {l.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="wrap flex flex-col gap-4 py-8">
          <a href={`tel:${config.telLien}`} className="flex items-center gap-3">
            <StatusDot open={status.open} />
            <span className="label text-paper/60">{status.label}</span>
            <span className="ml-auto whitespace-nowrap font-display text-xl font-extrabold sm:text-2xl">{config.tel}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenSimulator();
            }}
            className="btn-brand w-full !py-4"
          >
            Demander mon devis gratuit <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
