import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Bath,
  Droplets,
  Flame,
  Zap,
  Check,
  Loader2,
  Phone,
  CornerDownLeft,
} from "lucide-react";
import { config } from "./config/artisan.js";
import { Monogram } from "./components/Logo.jsx";

/* ---------- Config ---------- */
const ARTISAN_PRENOM = config.nomGerant.split(" ")[0];
const KEYS = ["A", "B", "C", "D", "E", "F"];
const NO_QUESTIONS = [];

/* ---------- Services (étape 0) ---------- */
const SERVICES = [
  { value: "sdb", label: "Rénovation salle de bain", hint: "Transformation complète de votre espace", icon: Bath },
  { value: "sanitaire", label: "Sanitaire & plomberie", hint: "Installation et réparation", icon: Droplets },
  { value: "chauffage", label: "Chauffage", hint: "Installation et entretien", icon: Flame },
  { value: "urgence", label: "Dépannage urgent", hint: "Fuite, panne : intervention rapide", icon: Zap, urgent: true },
];

/* ---------- Questions par service ---------- */
const BATIMENT = {
  key: "batiment",
  title: "Quel type de bâtiment ?",
  subtitle: "Pour préparer l'intervention au mieux.",
  options: [
    { value: "appart", label: "Appartement" },
    { value: "maison", label: "Maison individuelle" },
    { value: "local", label: "Local commercial" },
  ],
};

const FLOWS = {
  sdb: [
    {
      key: "type",
      title: "Que souhaitez-vous rénover ?",
      subtitle: "Choisissez ce qui correspond le mieux — on affinera ensemble.",
      options: [
        { value: "toilette", label: "Toilettes", hint: "WC et sanitaires" },
        { value: "douche", label: "Douche / baignoire", hint: "Espace bain" },
        { value: "complete", label: "Rénovation complète", hint: "Toute la pièce" },
        { value: "adefinir", label: "À définir ensemble", hint: "On en parle au rendez-vous" },
      ],
    },
    {
      key: "size",
      title: "Quelle est la taille de la pièce ?",
      subtitle: "Une estimation suffit — on mesurera lors de la visite.",
      options: [
        { value: "s", label: "Petite", hint: "Moins de 4 m²" },
        { value: "m", label: "Moyenne", hint: "4 à 8 m²" },
        { value: "l", label: "Grande", hint: "Plus de 8 m²" },
      ],
    },
    {
      key: "style",
      title: "Quel style vous attire ?",
      subtitle: "Vous pourrez tout ajuster lors du rendez-vous.",
      options: [
        { value: "scandinave", label: "Scandinave", hint: "Clair, doux, chaleureux" },
        { value: "mediterraneen", label: "Méditerranéen", hint: "Solaire, authentique" },
        { value: "moderne", label: "Moderne", hint: "Épuré, actuel, élégant" },
        { value: "naturel", label: "Naturel", hint: "Bois, pierre, tons chauds" },
      ],
    },
    {
      key: "budget",
      title: "Quel budget envisagez-vous ?",
      subtitle: "Sans engagement — ça aide juste à cadrer les propositions.",
      options: [
        { value: "b1", label: "500 € — 5 000 €" },
        { value: "b2", label: "5 000 € — 10 000 €" },
        { value: "b3", label: "10 000 € — 15 000 €" },
        { value: "b4", label: "Je ne sais pas encore" },
      ],
    },
  ],
  sanitaire: [
    {
      key: "travaux",
      title: "Quel est votre besoin ?",
      subtitle: "On précisera juste après.",
      options: [
        { value: "fuite", label: "Fuite / débouchage", hint: "Fuite, canalisation bouchée" },
        { value: "sanitaire", label: "WC & robinetterie", hint: "Toilettes, douche, robinet" },
        { value: "chauffeeau", label: "Chauffe-eau", hint: "Panne, remplacement" },
        { value: "installation", label: "Installation / rénovation", hint: "Neuf ou extension" },
      ],
    },
    {
      key: "nature",
      title: "De quoi s'agit-il ?",
      subtitle: "Pour cadrer au mieux l'intervention.",
      options: [
        { value: "reparation", label: "Une réparation" },
        { value: "remplacement", label: "Un remplacement" },
        { value: "neuf", label: "Une installation neuve" },
      ],
    },
    {
      key: "urgence",
      title: "Quel est le niveau d'urgence ?",
      subtitle: "On adapte la priorité du rappel en conséquence.",
      options: [
        { value: "urgent", label: "Urgent", hint: "Dans les 24 h" },
        { value: "semaine", label: "Cette semaine" },
        { value: "flexible", label: "Flexible", hint: "Quand vous pouvez" },
      ],
    },
    BATIMENT,
  ],
  chauffage: [
    {
      key: "typeChauffage",
      title: "Quel type de chauffage ?",
      subtitle: "Si vous hésitez, choisissez « Autre » — on en parlera au téléphone.",
      options: [
        { value: "gaz", label: "Chaudière gaz" },
        { value: "fioul", label: "Chaudière fioul" },
        { value: "electrique", label: "Radiateurs électriques" },
        { value: "autre", label: "Autre / je ne sais pas" },
      ],
    },
    {
      key: "intervention",
      title: "Quel type d'intervention ?",
      subtitle: "On adapte le devis à ce dont vous avez besoin.",
      options: [
        { value: "nouvelle", label: "Nouvelle installation" },
        { value: "remplacement", label: "Remplacement du système" },
        { value: "entretien", label: "Entretien annuel" },
        { value: "panne", label: "Panne / réparation" },
      ],
    },
    BATIMENT,
  ],
  urgence: [], // pas de questions — écran d'appel direct
};

/* ---------- Composant ---------- */
export default function Simulator({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle");
  const [flash, setFlash] = useState(null); // option qui clignote au choix
  const scrollRef = useRef(null);

  const questions = (service && FLOWS[service]) || NO_QUESTIONS;
  const totalSteps = service === "urgence" ? 2 : 1 + questions.length + 1;

  const kind = useMemo(() => {
    if (status === "sent") return "sent";
    if (step === 0) return "service";
    if (service === "urgence") return "urgence";
    if (step <= questions.length) return "question";
    return "form";
  }, [step, service, questions.length, status]);

  const progress =
    kind === "sent" ? 100 : service ? Math.round((step / (totalSteps - 1)) * 100) : 0;

  // Remise à zéro à la fermeture
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep(0);
      setService(null);
      setAnswers({});
      setLead({ name: "", phone: "", email: "" });
      setStatus("idle");
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const pick = useCallback(
    (value) => {
      if (flash) return;
      setFlash(value);
      setTimeout(() => {
        setFlash(null);
        if (step === 0) {
          setService(value);
          setAnswers({});
        } else {
          setAnswers((a) => ({ ...a, [questions[step - 1].key]: value }));
        }
        setStep((s) => s + 1);
      }, 280);
    },
    [flash, step, questions]
  );

  const goBack = useCallback(() => {
    if (status === "sent" || step === 0) return;
    if (step === 1) setService(null);
    setStep((s) => s - 1);
  }, [status, step]);

  // Options de l'étape en cours (pour le clavier)
  const currentOptions =
    kind === "service" ? SERVICES : kind === "question" ? questions[step - 1].options : null;

  // Raccourcis clavier : A/B/C/D (ou 1/2/3/4) pour répondre, Échap pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Backspace") return goBack();
      if (!currentOptions) return;
      const k = e.key.toUpperCase();
      let i = KEYS.indexOf(k);
      if (i === -1 && /^[1-9]$/.test(k)) i = Number(k) - 1;
      if (i >= 0 && i < currentOptions.length) pick(currentOptions[i].value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, currentOptions, pick, goBack, onClose]);

  const submitLead = (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!lead.name.trim() || !lead.phone.trim()) return;
    setStatus("sending");
    console.log("[Simulateur] Demande :", {
      service,
      answers,
      lead,
      submittedAt: new Date().toISOString(),
    });
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-paper text-ink transition-[clip-path] duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(100%_0_0_0)]"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Estimation de projet"
      inert={!open}
    >
      {/* Barre du haut */}
      <div className="border-b-2 border-ink">
        <div className="wrap flex items-center gap-4" style={{ height: "var(--header-h)" }}>
          <Monogram size={40} />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-extrabold">Estimation de projet</span>
            <span className="label text-[10px] text-ink/55">
              {kind === "sent" ? "Terminé" : service ? `Étape ${step + 1} / ${totalSteps}` : "Étape 1"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-11 w-11 place-items-center border-2 border-ink transition-colors hover:bg-ink hover:text-paper"
            aria-label="Fermer le simulateur"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="h-1.5 bg-paper-3">
        <div
          className="h-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Contenu */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6 md:py-16">
          {kind === "service" && (
            <Step n={1} title="Quel type de projet avez-vous ?" subtitle="Choisissez le service qui correspond à votre besoin.">
              <Options options={SERVICES} flash={flash} onPick={pick} withIcons />
            </Step>
          )}

          {kind === "question" && (
            <Step
              key={step}
              n={step + 1}
              title={questions[step - 1].title}
              subtitle={questions[step - 1].subtitle}
            >
              <Options
                options={questions[step - 1].options}
                selected={answers[questions[step - 1].key]}
                flash={flash}
                onPick={pick}
              />
            </Step>
          )}

          {kind === "urgence" && <UrgenceScreen onBack={goBack} />}

          {kind === "form" && (
            <Step
              n={step + 1}
              title="Dernière étape : vos coordonnées."
              subtitle={`${ARTISAN_PRENOM} vous rappelle sous 24 h pour en parler et caler une visite.`}
            >
              <div className="grid gap-8 md:grid-cols-[1fr_1.15fr]">
                <Recap service={service} answers={answers} />
                <form onSubmit={submitLead} className="flex flex-col gap-7">
                  <SimField
                    label="Nom & prénom"
                    value={lead.name}
                    onChange={(v) => setLead((l) => ({ ...l, name: v }))}
                    placeholder="Jean Dupont"
                    autoComplete="name"
                    required
                  />
                  <SimField
                    label="Téléphone"
                    type="tel"
                    value={lead.phone}
                    onChange={(v) => setLead((l) => ({ ...l, phone: v }))}
                    placeholder="06 12 34 56 78"
                    autoComplete="tel"
                    required
                  />
                  <SimField
                    label="Email (facultatif)"
                    type="email"
                    value={lead.email}
                    onChange={(v) => setLead((l) => ({ ...l, email: v }))}
                    placeholder="jean@exemple.fr"
                    autoComplete="email"
                  />
                  <button type="submit" disabled={status !== "idle"} className="btn-main mt-2 self-start">
                    {status === "idle" ? "Être rappelé" : "Envoi…"}
                    <span className="btn-arrow">
                      {status === "idle" ? (
                        <ArrowUpRight size={22} strokeWidth={2.4} />
                      ) : (
                        <Loader2 size={20} className="animate-spin" />
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </Step>
          )}

          {kind === "sent" && (
            <div className="fade-up text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center bg-brand text-brand-on">
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 className="h-display mx-auto mt-8 max-w-xl text-5xl sm:text-6xl">
                C'est noté, {lead.name.trim().split(" ")[0] || "à très vite"} !
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg text-ink/70">
                {ARTISAN_PRENOM} vous rappelle sous 24 h ouvrées au{" "}
                <strong className="text-ink">{lead.phone}</strong> pour convenir d'une visite.
              </p>
              <button type="button" onClick={onClose} className="btn-line mt-10">
                Retour au site
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barre du bas */}
      {kind !== "sent" && kind !== "urgence" && (
        <div className="border-t-2 border-ink">
          <div className="wrap flex items-center justify-between gap-4 py-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="btn-line !px-4 !py-2 text-sm disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowLeft size={16} /> Retour
            </button>
            {kind !== "form" && (
              <span className="label hidden items-center gap-2 text-[10px] text-ink/50 md:flex">
                Astuce : tapez <Kbd>A</Kbd> <Kbd>B</Kbd> <Kbd>C</Kbd>… pour répondre
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Écrans ---------- */
function Kbd({ children }) {
  return (
    <kbd className="inline-grid h-5 min-w-5 place-items-center border border-ink/40 px-1 font-mono text-[10px] text-ink/70">
      {children}
    </kbd>
  );
}

function Step({ n, title, subtitle, children }) {
  return (
    <div className="fade-up">
      <div className="label flex items-center gap-2 text-brand-text">
        {String(n).padStart(2, "0")} <ArrowRight size={14} />
      </div>
      <h2 className="h-display mt-4 text-[2.4rem] sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-xl text-lg text-ink/65">{subtitle}</p>}
      <div className="mt-10">{children}</div>
    </div>
  );
}

function Options({ options, selected, flash, onPick, withIcons }) {
  return (
    <div className={`grid gap-3 ${options.length === 4 ? "md:grid-cols-2" : ""}`}>
      {options.map((opt, i) => {
        const active = flash === opt.value || (!flash && selected === opt.value);
        const Icon = withIcons ? opt.icon : null;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className={`group flex items-center gap-4 border-2 p-4 text-left transition-all duration-150 sm:p-5 ${
              active
                ? "border-ink bg-ink text-paper"
                : opt.urgent
                  ? "border-red-700/40 bg-red-50/60 hover:border-red-700"
                  : "border-ink/20 bg-paper hover:border-ink hover:shadow-hard-sm"
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center border-2 font-mono text-sm font-semibold transition-colors ${
                active ? "border-paper bg-paper text-ink" : "border-current"
              }`}
            >
              {active ? <Check size={16} strokeWidth={3} /> : KEYS[i]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold leading-tight">{opt.label}</span>
              {opt.hint && (
                <span className={`mt-1 block text-sm ${active ? "text-paper/70" : "text-ink/60"}`}>
                  {opt.hint}
                </span>
              )}
            </span>
            {Icon && (
              <Icon
                size={24}
                strokeWidth={1.8}
                className={`shrink-0 ${active ? "text-brand-bright" : opt.urgent ? "text-red-700" : "text-ink/40"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function UrgenceScreen({ onBack }) {
  return (
    <div className="fade-up">
      <div className="label inline-flex items-center gap-2 bg-red-700 px-3 py-1.5 text-white">
        <Zap size={13} /> Urgence
      </div>
      <h2 className="h-display mt-6 text-[2.6rem] sm:text-6xl">
        Une urgence ? Appelez {ARTISAN_PRENOM} directement.
      </h2>
      <p className="mt-5 max-w-lg text-lg text-ink/70">
        Fuite, panne de chauffage, plus d'eau chaude : {ARTISAN_PRENOM} décroche en direct et
        intervient au plus vite — {config.zoneIntervention}.
      </p>
      <a
        href={`tel:${config.telLien}`}
        className="group mt-10 flex items-center gap-5 border-2 border-ink bg-ink p-5 text-paper shadow-hard-brand transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:p-6"
      >
        <span className="grid h-14 w-14 shrink-0 place-items-center bg-red-700 text-white sm:h-16 sm:w-16">
          <Phone size={26} strokeWidth={2.2} />
        </span>
        <span className="min-w-0">
          <span className="label block text-[10px] text-paper/60">Ligne directe de l'artisan</span>
          <span className="h-display mt-1 block whitespace-nowrap text-[2.1rem] sm:text-5xl">{config.tel}</span>
        </span>
      </a>
      {config.urgence24h && <p className="label mt-5 text-ink/55">Disponible 24 h/24 · 7 j/7</p>}
      <button type="button" onClick={onBack} className="btn-line mt-10 !px-4 !py-2 text-sm">
        <ArrowLeft size={16} /> Retour aux services
      </button>
    </div>
  );
}

function Recap({ service, answers }) {
  const svc = SERVICES.find((s) => s.value === service);
  const items = (FLOWS[service] || [])
    .map((q) => {
      const opt = q.options.find((o) => o.value === answers[q.key]);
      return opt && { key: q.key, title: q.title.replace(/\s*\?$/, ""), value: opt.label };
    })
    .filter(Boolean);

  return (
    <div className="self-start border-2 border-dashed border-ink/40 bg-paper-2 p-5">
      <div className="label flex items-center justify-between text-[10px] text-ink/55">
        Récapitulatif <CornerDownLeft size={14} />
      </div>
      <div className="mt-3 border-b-2 border-ink pb-3 font-display text-xl font-extrabold">{svc?.label}</div>
      <dl className="mt-1">
        {items.map((it) => (
          <div key={it.key} className="flex justify-between gap-4 border-b border-dashed border-ink/25 py-2.5 text-sm last:border-0">
            <dt className="text-ink/55">{it.title}</dt>
            <dd className="text-right font-semibold">{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SimField({ label, value, onChange, type = "text", placeholder, autoComplete, required }) {
  return (
    <label className="block">
      <span className="label mb-2 block text-[10px] text-ink/55">
        {label}
        {required && <span className="text-brand-text"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="field-line text-lg"
      />
    </label>
  );
}
