import { config } from "../config/artisan.js";
import { useCountUp } from "../lib/hooks.js";

function Stat({ s, i }) {
  const decimals = s.decimals || 0;
  const [ref, value] = useCountUp(s.value, { decimals });
  const display = decimals ? value.toFixed(decimals).replace(".", ",") : value;
  return (
    <div
      ref={ref}
      className={`py-6 sm:py-8 ${i > 0 ? "border-t-2 border-ink sm:border-l-2 sm:border-t-0 sm:pl-6 lg:pl-8" : "sm:pr-6"}`}
    >
      <div className="h-display text-6xl tabular-nums lg:text-7xl">
        {display}
        <span className="text-brand-text">{s.suffix}</span>
      </div>
      <div className="mt-3 max-w-[14rem] text-[15px] leading-snug text-ink/65">{s.label}</div>
    </div>
  );
}

export default function Artisan() {
  const prenom = config.nomGerant.split(" ")[0];
  return (
    <section id="artisan" className="relative border-y-2 border-ink bg-paper-2 py-20 lg:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Portrait */}
        <div className="lg:col-span-5">
          <figure data-reveal className="relative mx-auto max-w-[420px] pb-3 pr-3 lg:mx-0">
            <div className="absolute bottom-0 right-0 h-[calc(100%-12px)] w-[calc(100%-12px)] bg-ink" />
            <div className="relative overflow-hidden border-2 border-ink bg-ink">
              <img
                src={config.portrait}
                alt={`${config.nomGerant}, artisan fondateur de ${config.nomEntreprise}`}
                loading="lazy"
                width={688}
                height={860}
                style={{ objectPosition: config.portraitPosition }}
                className="aspect-[4/5] w-full object-cover grayscale-[15%]"
              />
            </div>
            <figcaption className="absolute -bottom-6 left-4 right-10 border-2 border-ink bg-brand px-4 py-3 text-brand-on sm:left-6">
              <span className="block font-display text-xl font-extrabold leading-tight">{config.nomGerant}</span>
              <span className="label mt-1 block text-[10px] opacity-80">{config.metierLignes}</span>
            </figcaption>
          </figure>
        </div>

        {/* Texte */}
        <div className="flex flex-col lg:col-span-7 lg:pt-4">
          <div data-reveal className="section-tag text-brand-text">(02) — L'artisan</div>
          <blockquote data-reveal className="relative mt-8" style={{ "--d": "80ms" }}>
            <span
              aria-hidden="true"
              className="h-display absolute -left-1 -top-10 text-[7rem] leading-none text-brand sm:-left-3"
            >
              “
            </span>
            <p className="relative font-display text-[1.75rem] font-bold leading-[1.15] tracking-tight sm:text-[2.35rem] lg:text-[2.7rem]">
              {config.citation}
            </p>
            <footer className="label mt-6 text-ink/60">— {prenom}, fondateur de {config.nomEntreprise}</footer>
          </blockquote>
          <p data-reveal className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70" style={{ "--d": "140ms" }}>
            {config.presentation}
          </p>

          <div data-reveal className="mt-12 grid border-y-2 border-ink sm:grid-cols-3" style={{ "--d": "200ms" }}>
            {config.stats.map((s, i) => (
              <Stat key={s.label} s={s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
