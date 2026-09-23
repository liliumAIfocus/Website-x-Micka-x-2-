import { useState } from "react";
import { ArrowUpRight, Check, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { config } from "../config/artisan.js";
import { useOpenStatus } from "../lib/hooks.js";
import { StatusDot } from "./Header.jsx";

const BESOINS = ["Dépannage", "Salle de bain", "Chauffage", "Autre"];

function Field({ label, name, type = "text", required, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="label mb-2 block text-[10px] text-ink/55">
        {label}
        {required && <span className="text-brand-text"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="field-line"
      />
    </label>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-4 border-t border-paper/15 py-4">
      <Icon size={18} className="mt-0.5 text-brand-bright" />
      <div>
        <div className="label text-[10px] text-paper/50">{label}</div>
        <div className="mt-1 text-paper/90">{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [state, setState] = useState("idle");
  const [besoin, setBesoin] = useState(null);
  const status = useOpenStatus(config.horaires, config.urgence24h);
  const prenom = config.nomGerant.split(" ")[0];

  const submit = (e) => {
    e.preventDefault();
    if (state !== "idle") return;
    setState("sending");
    setTimeout(() => setState("sent"), 1400);
  };

  return (
    <section id="contact" className="relative bg-ink py-20 text-paper lg:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Coordonnées */}
        <div className="lg:col-span-6">
          <div data-reveal className="section-tag text-brand-bright">(07) — Contact</div>
          <h2 data-reveal className="h-section mt-5" style={{ "--d": "80ms" }}>
            Un projet, une urgence ? <span className="text-brand-bright">Parlons-en.</span>
          </h2>

          <a
            data-reveal
            href={`tel:${config.telLien}`}
            className="group mt-10 block"
            style={{ "--d": "140ms" }}
          >
            <span className="label flex items-center gap-2 text-paper/60">
              <StatusDot open={status.open} /> {status.label} — {prenom} décroche en direct
            </span>
            <span className="h-display mt-3 block whitespace-nowrap text-[2.9rem] transition-colors group-hover:text-brand-bright sm:text-7xl lg:text-[4.6rem] xl:text-[5.4rem]">
              {config.tel}
            </span>
          </a>

          <div data-reveal className="mt-10" style={{ "--d": "200ms" }}>
            <InfoRow icon={Mail} label="Email">
              <a href={`mailto:${config.email}`} className="link-fill break-all">
                {config.email}
              </a>
            </InfoRow>
            <InfoRow icon={Phone} label="Téléphone">
              <a href={`tel:${config.telLien}`} className="link-fill">
                {config.tel}
              </a>
            </InfoRow>
            <InfoRow icon={MapPin} label="Secteur">
              {config.ville} · {config.rayonKm} km autour de {config.villeProche}
            </InfoRow>
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-6">
          <form
            data-reveal
            onSubmit={submit}
            className="relative border-2 border-paper bg-paper p-6 text-ink shadow-hard-brand sm:p-8"
            style={{ "--d": "120ms" }}
          >
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
              <h3 className="h-display text-3xl">Demande de devis</h3>
              <span className="label text-[10px] text-ink/50">Réponse sous 24 h</span>
            </div>

            <fieldset className="mt-7">
              <legend className="label mb-3 text-[10px] text-ink/55">Votre besoin</legend>
              <div className="flex flex-wrap gap-2">
                {BESOINS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBesoin(b)}
                    aria-pressed={besoin === b}
                    className={`border-2 px-3.5 py-2 font-display text-sm font-bold transition-colors ${
                      besoin === b
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/25 hover:border-ink"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <Field label="Nom" name="name" required autoComplete="name" placeholder="Jean Dupont" />
              <Field label="Téléphone" name="phone" type="tel" required autoComplete="tel" placeholder="06 12 34 56 78" />
              <Field label="Email" name="email" type="email" autoComplete="email" placeholder="jean@exemple.fr" />
              <Field label="Code postal" name="zip" autoComplete="postal-code" placeholder={config.codePostal} />
            </div>
            <label className="mt-7 block">
              <span className="label mb-2 block text-[10px] text-ink/55">Votre projet en deux mots</span>
              <textarea
                rows={3}
                className="field-line resize-none"
                placeholder="Ex : fuite sous l'évier, remplacement de chaudière, douche à l'italienne…"
              />
            </label>

            <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[16rem] text-xs text-ink/50">
                Vos informations servent uniquement à vous recontacter.
              </p>
              <button
                type="submit"
                disabled={state !== "idle"}
                className={`btn-main self-start sm:self-auto ${state === "sent" ? "!bg-emerald-700" : ""}`}
              >
                {state === "idle" && "Envoyer ma demande"}
                {state === "sending" && "Envoi en cours…"}
                {state === "sent" && "Demande envoyée"}
                <span className="btn-arrow">
                  {state === "idle" && <ArrowUpRight size={22} strokeWidth={2.4} />}
                  {state === "sending" && <Loader2 size={20} className="animate-spin" />}
                  {state === "sent" && <Check size={22} strokeWidth={3} />}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
