import { ArrowUpRight, Phone, ShieldCheck, FileText, Star } from "lucide-react";
import { config } from "../config/artisan.js";
import { useMediaQuery } from "../lib/hooks.js";

/* Badge circulaire qui tourne : texte sur un cercle + icône au centre */
function RotatingBadge({ className = "" }) {
  const text = "Devis gratuit ✱ Garantie décennale ✱ ";
  return (
    <div className={`pointer-events-none grid h-32 w-32 place-items-center sm:h-36 sm:w-36 ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute h-full w-full">
        <circle cx="100" cy="100" r="98" fill="rgb(var(--paper-rgb))" stroke="rgb(var(--ink-rgb))" strokeWidth="3" />
        <defs>
          <path id="badge-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text
          fill="rgb(var(--ink-rgb))"
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15.5, fontWeight: 600, letterSpacing: 2.2, textTransform: "uppercase" }}
        >
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="relative grid h-12 w-12 place-items-center bg-brand text-brand-on sm:h-14 sm:w-14">
        <ShieldCheck size={26} strokeWidth={2.2} />
      </span>
    </div>
  );
}

const FACTS = [
  { icon: FileText, top: "Devis gratuit", bottom: "détaillé, sans engagement" },
  { icon: ShieldCheck, top: "Garantie", bottom: "décennale" },
  { icon: Star, top: `${config.noteSurCinq} Google`, bottom: `${config.nbAvis} avis clients` },
];

export default function Hero({ onOpenSimulator }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const heroVideo = isMobile
    ? config.heroVideoMobile || config.heroVideoDesktop
    : config.heroVideoDesktop || config.heroVideoMobile;
  const metier = config.metierLignes.split("·")[0].trim();

  return (
    <section id="top" className="relative" style={{ paddingTop: "var(--header-h)" }}>
      <div className="wrap grid gap-12 pb-16 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-14">
        {/* Colonne texte */}
        <div className="flex flex-col lg:col-span-7">
          <div className="fade-up label flex items-center gap-2.5 text-ink/70">
            <span className="h-2.5 w-2.5 bg-brand" />
            {metier} — {config.heroLieu || `${config.ville} (${config.codePostal})`}
          </div>

          <h1 className="h-display mt-6 text-[3.15rem] sm:text-[4.6rem] lg:text-[5.3rem] xl:text-[6.3rem]">
            <span className="line-mask">
              <span style={{ "--d": "80ms" }}>{config.hero_titre}</span>
            </span>
            <span className="line-mask">
              <span className="text-brand-text" style={{ "--d": "200ms" }}>
                {config.hero_titre_fin}
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-7 max-w-xl text-lg leading-relaxed text-ink/75 md:text-xl"
            style={{ "--d": "420ms" }}
          >
            {config.hero_sous_titre}
          </p>

          <div
            className="fade-up mt-9 flex flex-col gap-6 sm:flex-row sm:items-center"
            style={{ "--d": "540ms" }}
          >
            <button type="button" onClick={onOpenSimulator} className="btn-main self-start">
              Estimer mon projet
              <span className="btn-arrow">
                <ArrowUpRight size={22} strokeWidth={2.4} />
              </span>
            </button>
            <a href={`tel:${config.telLien}`} className="group flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center border-2 border-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Phone size={20} strokeWidth={2.2} />
              </span>
              <span className="flex flex-col">
                <span className="label text-[10px] text-ink/55">Ou appelez directement</span>
                <span
                  className="link-fill self-start font-display text-xl font-extrabold"
                  style={{ fontVariationSettings: '"wdth" 85' }}
                >
                  {config.tel}
                </span>
              </span>
            </a>
          </div>

          <dl
            className="fade-up mt-12 grid grid-cols-3 border-y-2 border-ink lg:mt-auto"
            style={{ "--d": "680ms" }}
          >
            {FACTS.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.top}
                  className={`flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-3 sm:py-5 ${
                    i > 0 ? "border-l-2 border-ink pl-3 sm:pl-5" : "pr-3"
                  }`}
                >
                  <Icon size={20} className="shrink-0 text-brand-text" strokeWidth={2.2} />
                  <div className="min-w-0">
                    <dt className="font-display text-[15px] font-bold leading-tight sm:text-base">{f.top}</dt>
                    <dd className="text-xs leading-snug text-ink/60 sm:text-sm">{f.bottom}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Colonne image */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[460px] pb-3 pr-3 sm:max-w-[520px] lg:ml-auto lg:mr-0 lg:max-w-none">
            {/* Bloc de couleur décalé (ombre dure) */}
            <div className="wipe-in absolute bottom-0 right-0 h-[calc(100%-12px)] w-[calc(100%-12px)] bg-brand" style={{ "--d": "250ms" }} />
            <figure className="wipe-in relative border-2 border-ink bg-ink" style={{ "--d": "100ms" }}>
              <div className="aspect-[4/5] overflow-hidden lg:aspect-[4/5.2]">
                {heroVideo ? (
                  <video
                    key={heroVideo}
                    className="h-full w-full object-cover"
                    src={heroVideo}
                    poster={config.hero}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={config.hero}
                    alt={config.heroLegende || `Chantier ${config.nomEntreprise}`}
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                  />
                )}
              </div>
              {config.heroLegende && (
                <figcaption className="flex items-start gap-4 border-t-2 border-ink bg-paper px-4 py-3">
                  <span className="label shrink-0 pt-0.5 text-brand-text">Fig. 01</span>
                  <span className="text-sm leading-snug text-ink/75">{config.heroLegende}</span>
                </figcaption>
              )}
            </figure>
            <RotatingBadge className="fade-up absolute -left-4 top-8 sm:-left-12 lg:-left-16 lg:top-auto lg:bottom-28" />
          </div>
        </div>
      </div>
    </section>
  );
}
