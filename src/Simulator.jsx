import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Bath,
  Droplets,
  Flame,
  ShieldCheck,
  BadgeCheck,
  Check,
  Loader2,
  Phone,
  Star,
  MessageCircle,
} from "lucide-react";
import { config } from "./config/artisan.js";
import { Monogram } from "./components/Logo.jsx";
import { STEPS as ETAPES, HEX } from "./lib/methode.js";
import { prochainRappel } from "./lib/hooks.js";

/* ---------- Config ---------- */
const ARTISAN_PRENOM = config.nomGerant.split(" ")[0];
const KEYS = ["A", "B", "C", "D", "E", "F"];
const NO_QUESTIONS = [];
const AMBIANCES = config.ambiances || {};

/* ---------- Services (étape 0) ---------- */
// Les 4 familles de prestations (mêmes noms que la section Prestations).
// Pas de « Dépannage urgent » : en cas d'urgence, le client appelle
// directement (bouton Appeler, fiche Google).
// `avisMots` : mots-clés pour retrouver l'avis client le plus proche du service
const SERVICES = [
  { value: "plomberie", label: "Plomberie", icon: Droplets, avisMots: ["plomberie", "fuite", "sanitaire", "débouchage"] },
  { value: "chauffage", label: "Chauffage & énergie", icon: Flame, avisMots: ["chaudière", "chauffage", "chauffe-eau"] },
  { value: "sdb", label: "Salle de bain", icon: Bath, avisMots: ["salle de bain", "rénovation"] },
  { value: "normes", label: "Mise aux normes", icon: ShieldCheck, avisMots: ["normes", "électri"] },
];

/* ---------- Questions par service ---------- */
// `short` : intitulé court sur la fiche chantier. `recap` : valeur affichée sur
// la fiche si différente du libellé. `skip` : question sautée selon les réponses.

// Type de chauffe-eau : posée seulement si le client a choisi « Chauffe-eau »
// (dans Plomberie ou dans Chauffage & énergie).
const typeChauffeEau = (skip) => ({
  key: "chauffeEau",
  short: "Chauffe-eau",
  skip,
  title: "Quel type de chauffe-eau ?",
  options: [
    { value: "electrique", label: "Électrique" },
    { value: "thermo", label: "Thermodynamique" },
    { value: "extraplat", label: "Extra-plat" },
    { value: "nsp", label: "Je ne sais pas", recap: "À définir" },
  ],
});

const FLOWS = {
  plomberie: [
    {
      key: "travaux",
      short: "Besoin",
      title: "Quel est votre besoin ?",
      options: [
        { value: "fuite", label: "Fuite / débouchage" },
        { value: "sanitaire", label: "WC & robinetterie" },
        { value: "chauffeeau", label: "Chauffe-eau" },
        { value: "installation", label: "Installation / rénovation" },
      ],
    },
    typeChauffeEau((answers) => answers.travaux !== "chauffeeau"),
    {
      key: "nature",
      short: "Nature",
      title: "De quoi s'agit-il ?",
      options: [
        { value: "reparation", label: "Une réparation", recap: "Réparation" },
        { value: "remplacement", label: "Un remplacement", recap: "Remplacement" },
        { value: "neuf", label: "Une installation neuve", recap: "Installation neuve" },
      ],
    },
    {
      key: "delai",
      short: "Délai",
      title: "Pour quand ?",
      options: [
        { value: "rapide", label: "Rapidement" },
        { value: "mois", label: "Dans le mois" },
        { value: "flexible", label: "Flexible" },
      ],
    },
  ],
  chauffage: [
    {
      key: "typeChauffage",
      short: "Équipement",
      title: "Quel équipement est concerné ?",
      options: [
        { value: "chaudiere", label: "Chaudière gaz ou fioul", recap: "Chaudière" },
        { value: "chauffeeau", label: "Chauffe-eau" },
        { value: "electrique", label: "Radiateurs électriques" },
        { value: "autre", label: "Autre / je ne sais pas", recap: "À préciser" },
      ],
    },
    typeChauffeEau((answers) => answers.typeChauffage !== "chauffeeau"),
    {
      key: "intervention",
      short: "Intervention",
      title: "Quel type d'intervention ?",
      options: [
        { value: "nouvelle", label: "Nouvelle installation" },
        { value: "remplacement", label: "Remplacement" },
        { value: "entretien", label: "Entretien annuel" },
        { value: "panne", label: "Panne / réparation" },
      ],
    },
  ],
  sdb: [
    {
      key: "type",
      short: "Travaux",
      title: "Que souhaitez-vous rénover ?",
      options: [
        { value: "toilette", label: "Toilettes" },
        { value: "douche", label: "Douche / baignoire" },
        { value: "complete", label: "Rénovation complète" },
        { value: "adefinir", label: "À définir ensemble" },
      ],
    },
    {
      key: "size",
      short: "Surface",
      skip: (answers) => answers.type === "toilette", // inutile pour des WC
      title: "Quelle est la taille de la pièce ?",
      options: [
        { value: "s", label: "Petite", recap: "Moins de 4 m²" },
        { value: "m", label: "Moyenne", recap: "4 à 8 m²" },
        { value: "l", label: "Grande", recap: "Plus de 8 m²" },
      ],
    },
    {
      key: "style",
      short: "Style",
      title: "Quel style vous attire ?",
      // Photos : config.ambiances.sdb, ou .toilettes si « Toilettes » est choisi
      photos: true,
      options: [
        { value: "scandinave", label: "Scandinave" },
        { value: "mediterraneen", label: "Méditerranéen" },
        { value: "moderne", label: "Moderne" },
        { value: "autre", label: "Autre / j'hésite", recap: "À définir ensemble" },
      ],
    },
  ],
  normes: [
    {
      key: "domaine",
      short: "Domaine",
      title: "Qu'est-ce qui doit être mis aux normes ?",
      options: [
        { value: "electricite", label: "Électricité" },
        { value: "gaz", label: "Gaz" },
        { value: "ventilation", label: "Ventilation / VMC" },
        { value: "diagnostic", label: "Je ne sais pas", recap: "Diagnostic à faire" },
      ],
    },
    {
      key: "contexte",
      short: "Contexte",
      title: "Dans quel cadre ?",
      options: [
        { value: "vente", label: "Vente ou location", recap: "Vente / location" },
        { value: "achat", label: "Achat ou rénovation", recap: "Achat / rénovation" },
        { value: "assurance", label: "Demande de l'assurance", recap: "Assurance" },
        { value: "securite", label: "Pour ma sécurité", recap: "Sécurité" },
      ],
    },
    {
      key: "logement",
      short: "Logement",
      title: "Quel type de logement ?",
      options: [
        { value: "maison", label: "Maison" },
        { value: "appartement", label: "Appartement" },
        { value: "local", label: "Local professionnel", recap: "Local pro" },
      ],
    },
  ],
};

/* Numéro de dossier façon bon d'intervention : AAMM-JJ-xx */
function numeroDossier() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getFullYear() % 100)}${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(Math.floor(Math.random() * 100))}`;
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* Numéro français : 06 12 34 56 78, 06.12.34.56.78, +33 6 12 34 56 78… */
const telValide = (v) =>
  /^(?:(?:\+|00)33[1-9]\d{8}|0[1-9]\d{8})$/.test(v.replace(/[\s.\-()]/g, ""));

/* Photos des styles : spéciales toilettes si « Toilettes » est choisi */
const galerie = (answers) =>
  (answers.type === "toilette" ? AMBIANCES.toilettes : AMBIANCES.sdb) || {};

/* Options d'une question, avec la photo de chaque style si besoin */
/* Questions réellement posées, selon les réponses déjà données */
const flowOf = (service, answers) => (FLOWS[service] || []).filter((q) => !q.skip?.(answers));

const optionsOf = (q, answers) =>
  q.photos ? q.options.map((o) => ({ ...o, photo: galerie(answers)[o.value] })) : q.options;

/* ---------- Composant ---------- */
export default function Simulator({ open, initialService, onClose }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [answers, setAnswers] = useState({});
  const [lead, setLead] = useState({ name: "", phone: "", ville: "" });
  const [status, setStatus] = useState("idle");
  const [flash, setFlash] = useState(null); // option qui clignote au choix
  const [dir, setDir] = useState(1); // sens de la transition : 1 = suivant, -1 = retour
  const [dossier, setDossier] = useState("");
  const [telRefuse, setTelRefuse] = useState(null); // numéro refusé à l'envoi
  const scrollRef = useRef(null);

  const questions = useMemo(
    () => (service ? flowOf(service, answers) : NO_QUESTIONS),
    [service, answers]
  );
  const totalSteps = 1 + questions.length + 1;

  const kind = useMemo(() => {
    if (status === "sent") return "sent";
    if (step === 0) return "service";
    if (step <= questions.length) return "question";
    return "form";
  }, [step, service, questions.length, status]);

  const progress =
    kind === "sent" ? 100 : service ? Math.round((step / (totalSteps - 1)) * 100) : 0;

  const remaining = questions.length - step + 1;
  const headerNote =
    kind === "sent"
      ? "Demande envoyée"
      : kind === "form"
        ? "Dernière étape"
        : kind === "service"
          ? "2 à 4 questions · 30 secondes"
          : remaining === 1
            ? "Dernière question"
            : `Plus que ${remaining} questions`;

  // La fiche chantier accompagne les questions et l'étape coordonnées
  const withFiche = kind === "question" || kind === "form";
  const question = kind === "question" ? questions[step - 1] : null;
  const questionOptions = question ? optionsOf(question, answers) : null;

  // Jour de rappel promis (recalculé à chaque arrivée sur l'étape coordonnées)
  const rappel = useMemo(() => prochainRappel(config.horaires), [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  // Remise à zéro à la fermeture
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep(0);
      setService(null);
      setAnswers({});
      setLead({ name: "", phone: "", ville: "" });
      setStatus("idle");
      setDir(1);
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  // Ouverture depuis une prestation : on saute le choix du service
  useEffect(() => {
    if (!open || !SERVICES.some((s) => s.value === initialService)) return;
    setService(initialService);
    setAnswers({});
    setDossier(numeroDossier());
    setStatus("idle");
    setDir(1);
    setStep(1);
  }, [open, initialService]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step, status]);

  // Précharge les photos d'ambiance dès que la salle de bain est choisie
  useEffect(() => {
    if (service !== "sdb") return;
    [AMBIANCES.sdb, AMBIANCES.toilettes].forEach((g) =>
      Object.values(g || {}).forEach((src) => {
        if (src) new Image().src = src;
      })
    );
  }, [service]);

  const pick = useCallback(
    (value) => {
      if (flash) return;
      setFlash(value);
      setDir(1);
      setTimeout(() => {
        setFlash(null);
        if (step === 0) {
          setService(value);
          setAnswers({});
          setDossier(numeroDossier());
        } else {
          setAnswers((a) => {
            const next = { ...a, [questions[step - 1].key]: value };
            // Oublie les réponses des questions devenues inutiles
            FLOWS[service].forEach((q) => q.skip?.(next) && delete next[q.key]);
            return next;
          });
        }
        setStep((s) => s + 1);
      }, 280);
    },
    [flash, step, questions, service]
  );

  const goBack = useCallback(() => {
    if (status === "sent" || step === 0) return;
    setDir(-1);
    if (step === 1) setService(null);
    setStep((s) => s - 1);
  }, [status, step]);

  // Options de l'étape en cours (pour le clavier)
  const currentOptions = kind === "service" ? SERVICES : questionOptions;

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

  // L'erreur disparaît dès que le client modifie le numéro refusé
  const phoneError = telRefuse !== null && telRefuse === lead.phone;

  const submitLead = (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!lead.name.trim() || !lead.phone.trim() || !lead.ville.trim()) return;
    if (!telValide(lead.phone)) return setTelRefuse(lead.phone);
    setStatus("sending");
    console.log("[Simulateur] Demande :", {
      dossier,
      service,
      answers,
      lead,
      rappel,
      submittedAt: new Date().toISOString(),
    });
    setTimeout(() => {
      setDir(1);
      setStatus("sent");
    }, 1200);
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
        <div className="wrap flex h-[60px] items-center gap-4 sm:h-[var(--header-h)]">
          <Monogram size={40} />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-extrabold">Estimation de projet</span>
            <span className="label text-[10px] text-ink/55">{headerNote}</span>
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className={`mx-auto flex min-h-full w-full flex-col justify-start px-4 py-5 sm:px-6 sm:py-10 md:justify-center md:py-14 ${
            withFiche ? "max-w-6xl" : kind === "sent" ? "max-w-5xl" : "max-w-3xl"
          }`}
        >
          <div
            className={
              withFiche
                ? "grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]"
                : ""
            }
          >
            <div key={`${kind}-${step}`} className={dir === 1 ? "step-next" : "step-prev"}>
              {kind === "service" && (
                <Step n={1} title="Quel type de projet avez-vous ?">
                  <Options options={SERVICES} flash={flash} onPick={pick} withIcons />
                </Step>
              )}

              {question && (
                <Step n={step + 1} title={question.title}>
                  <Options
                    options={questionOptions}
                    selected={answers[question.key]}
                    flash={flash}
                    onPick={pick}
                  />
                </Step>
              )}

              {kind === "form" && (
                <Step n={step + 1} title="Votre projet est prêt. Où peut-on vous rappeler ?">
                  <div className="flex max-w-xl items-center gap-4 border-2 border-ink bg-ink p-3 text-paper shadow-hard-brand sm:p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-brand text-brand-on sm:h-12 sm:w-12">
                      <Phone size={22} strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0">
                      <span className="label block text-[10px] text-paper/60">Rappel prévu</span>
                      <span className="mt-0.5 block font-display text-xl font-bold leading-tight sm:text-2xl">
                        {capitalize(rappel)}
                      </span>
                      <span className="mt-0.5 hidden text-sm text-paper/70 sm:block">
                        {ARTISAN_PRENOM} vous appelle en direct
                      </span>
                    </span>
                  </div>

                  <form onSubmit={submitLead} className="mt-5 flex max-w-xl flex-col gap-4 sm:mt-9 sm:gap-7">
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
                      error={phoneError}
                      placeholder="06 12 34 56 78"
                      autoComplete="tel"
                      required
                    />
                    <SimField
                      label="Ville"
                      value={lead.ville}
                      onChange={(v) => setLead((l) => ({ ...l, ville: v }))}
                      placeholder={config.villeProche}
                      autoComplete="address-level2"
                      required
                    />
                    <button type="submit" disabled={status !== "idle"} className="btn-main mt-2 self-start">
                      {status === "idle" ? "Réserver mon rappel gratuit" : "Envoi…"}
                      <span className="btn-arrow">
                        {status === "idle" ? (
                          <ArrowUpRight size={22} strokeWidth={2.4} />
                        ) : (
                          <Loader2 size={20} className="animate-spin" />
                        )}
                      </span>
                    </button>
                  </form>

                  <Reassurance service={service} />
                </Step>
              )}

              {kind === "sent" && (
                <div>
                  <div className="label inline-flex items-center gap-2 bg-brand px-3 py-1.5 text-brand-on">
                    <Check size={13} strokeWidth={3} /> Demande envoyée
                  </div>
                  <h2 className="h-display mt-6 text-5xl sm:text-6xl">
                    C'est noté, {lead.name.trim().split(" ")[0] || "à très vite"} !
                  </h2>
                  <p className="mt-5 max-w-xl text-lg text-ink/70">
                    {ARTISAN_PRENOM} vous rappelle <strong className="text-ink">{rappel}</strong> au{" "}
                    <strong className="whitespace-nowrap text-ink">{lead.phone}</strong> pour parler de
                    votre projet et convenir d'une visite.
                  </p>
                  <div className="mt-12 grid items-start gap-12 md:grid-cols-2">
                    <FicheChantier service={service} answers={answers} dossier={dossier} tampon />
                    <div>
                      <div className="label mb-6 text-[10px] text-ink/55">La suite</div>
                      <FriseEtapes rappel={rappel} />
                      <button type="button" onClick={onClose} className="btn-line mt-10">
                        Retour au site
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {withFiche && (
              <aside className="sticky top-0 hidden lg:block">
                <FicheChantier service={service} answers={answers} dossier={dossier} />
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Mobile : résumé de la fiche chantier en étiquettes (pendant les questions) */}
      {kind === "question" && <FicheMobile service={service} answers={answers} dossier={dossier} />}

      {/* Barre du bas */}
      {kind !== "sent" && (
        <div className="border-t-2 border-ink">
          <div className="wrap flex items-center justify-between gap-4 py-2 sm:py-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="btn-line min-h-[44px] !px-4 !py-2 text-sm disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowLeft size={16} /> Retour
            </button>
            {(kind === "service" || kind === "question") && (
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

function Step({ n, title, children }) {
  return (
    <div>
      <div className="label flex items-center gap-2 text-brand-text">
        {String(n).padStart(2, "0")} <ArrowRight size={14} />
      </div>
      <h2 className="h-display mt-2 text-[2rem] sm:mt-4 sm:text-5xl">{title}</h2>
      <div className="mt-5 sm:mt-10">{children}</div>
    </div>
  );
}

function Options({ options, selected, flash, onPick, withIcons }) {
  if (options.some((o) => o.photo)) {
    return <PhotoOptions options={options} selected={selected} flash={flash} onPick={onPick} />;
  }
  return (
    <div className={`grid gap-2 sm:gap-3 ${options.length === 4 ? "md:grid-cols-2" : ""}`}>
      {options.map((opt, i) => {
        const active = flash === opt.value || (!flash && selected === opt.value);
        const Icon = withIcons ? opt.icon : null;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className={`group flex items-center gap-3 border-2 px-3 py-3 text-left transition-all duration-150 sm:gap-4 sm:p-5 ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-paper hover:border-ink hover:shadow-hard-sm"
            }`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center border-2 font-mono text-sm font-semibold transition-colors sm:h-9 sm:w-9 ${
                active ? "border-paper bg-paper text-ink" : "border-current"
              }`}
            >
              {active ? <Check size={16} strokeWidth={3} /> : KEYS[i]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[17px] font-bold leading-tight sm:text-lg">{opt.label}</span>
            </span>
            {Icon && (
              <Icon
                size={24}
                strokeWidth={1.8}
                className={`shrink-0 ${active ? "text-brand-bright" : "text-ink/40"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Cartes-photos (styles). Une option sans photo (« Autre / j'hésite »)
   devient une carte « porte de sortie », pour que personne ne reste bloqué. */
function PhotoOptions({ options, selected, flash, onPick }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
      {options.map((opt, i) => {
        const active = flash === opt.value || (!flash && selected === opt.value);
        const cls = `group relative aspect-[4/3] overflow-hidden border-2 text-left transition-all duration-200 md:aspect-[3/4] ${
          active
            ? "-translate-x-0.5 -translate-y-0.5 border-ink shadow-hard-brand"
            : "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-sm"
        }`;
        const key = (
          <span
            className={`absolute left-2 top-2 grid h-7 w-7 place-items-center border-2 font-mono text-xs font-semibold transition-colors sm:left-2.5 sm:top-2.5 sm:h-8 sm:w-8 sm:text-sm ${
              active ? "border-brand bg-brand text-brand-on" : "border-ink bg-paper text-ink"
            }`}
          >
            {active ? <Check size={15} strokeWidth={3} /> : KEYS[i]}
          </span>
        );

        if (!opt.photo) {
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPick(opt.value)}
              className={`${cls} flex flex-col justify-end border-dashed ${
                active ? "bg-ink text-paper" : "border-ink/50 bg-paper-2 hover:border-ink"
              }`}
            >
              {key}
              <MessageCircle
                size={30}
                strokeWidth={1.6}
                className={`absolute right-3 top-3 sm:right-4 sm:top-4 ${active ? "text-brand-bright" : "text-brand-text"}`}
              />
              <span className="p-2.5 sm:p-3">
                <span className="block font-display text-base font-bold leading-tight">{opt.label}</span>
              </span>
            </button>
          );
        }

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className={`${cls} border-ink`}
          >
            <img
              src={opt.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_75%] transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            {key}
            <span className="absolute inset-x-0 bottom-0 p-2.5 text-paper sm:p-3">
              <span className="block font-display text-base font-bold leading-tight">{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Lignes de la fiche : une par question, remplie ou en pointillés */
function ficheLignes(service, answers) {
  return flowOf(service, answers).map((q) => {
    const opt = q.options.find((o) => o.value === answers[q.key]);
    return { key: q.key, title: q.short, value: opt && (opt.recap || opt.label) };
  });
}

/* Fiche chantier : le « bon d'intervention » qui se remplit en direct */
function FicheChantier({ service, answers, dossier, tampon }) {
  const svc = SERVICES.find((s) => s.value === service);
  const Icon = svc?.icon;
  const style = service === "sdb" && answers.style;
  const photo = style && galerie(answers)[style];
  const styleLabel = style && FLOWS.sdb.find((q) => q.key === "style").options.find((o) => o.value === style)?.label;

  return (
    <div className="relative border-2 border-ink bg-paper shadow-hard">
      <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-paper">
        <span className="label text-[10px]">Fiche chantier</span>
        <span className="font-mono text-xs">N° {dossier}</span>
      </div>

      {photo && (
        <div key={photo} className="wipe-in relative aspect-[2/1] overflow-hidden border-y-2 border-ink">
          <img src={photo} alt={`Ambiance ${styleLabel}`} className="h-full w-full object-cover" />
          <span className="label absolute bottom-2 left-2 bg-paper px-2 py-1 text-[10px]">
            Ambiance {styleLabel}
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center bg-brand text-brand-on">
              <Icon size={20} strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0">
            <div className="font-display text-xl font-extrabold leading-tight">{svc?.label}</div>
            <div className="label mt-1 text-[10px] text-ink/50">{config.zoneIntervention}</div>
          </div>
        </div>

        <dl className="mt-4">
          {ficheLignes(service, answers).map((l) => (
            <div
              key={l.key}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/25 py-2.5 text-sm last:border-0"
            >
              <dt className="shrink-0 text-ink/55">{l.title}</dt>
              {l.value ? (
                <dd key={l.value} className="write-in text-right font-semibold">
                  {l.value}
                </dd>
              ) : (
                <dd className="h-2 min-w-0 flex-1 border-b-2 border-dotted border-ink/25">
                  <span className="sr-only">À compléter</span>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>

      {tampon && <Tampon surPhoto={!!photo} />}
    </div>
  );
}

/* Mobile : bandeau d'étiquettes au-dessus de la barre du bas */
function FicheMobile({ service, answers, dossier }) {
  const svc = SERVICES.find((s) => s.value === service);
  const chips = [svc?.label, ...ficheLignes(service, answers).map((l) => l.value)].filter(Boolean);
  const rowRef = useRef(null);
  // Défile jusqu'à la dernière réponse ajoutée
  useEffect(() => {
    const row = rowRef.current;
    if (row) row.scrollTo({ left: row.scrollWidth, behavior: "smooth" });
  }, [chips.length]);
  return (
    <div className="border-t-2 border-ink bg-paper-2 lg:hidden">
      <div ref={rowRef} className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2">
        <span className="label shrink-0 text-[10px] text-ink/55">N° {dossier}</span>
        {chips.map((c) => (
          <span key={c} className="write-in shrink-0 border border-ink bg-paper px-2 py-1 text-xs font-semibold">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Sur une photo : fond clair pour rester lisible. Sinon : encre transparente,
   le texte de la fiche reste visible dessous comme un vrai coup de tampon. */
function Tampon({ surPhoto }) {
  const date = new Date().toLocaleDateString("fr-FR");
  return (
    <div
      className={`stamp pointer-events-none absolute right-4 top-16 border-4 px-4 py-2 text-center ${
        surPhoto ? "border-brand bg-paper/85 text-brand-text" : "border-brand/75 text-brand-text/75 mix-blend-multiply"
      }`}
      style={{ "--d": "450ms" }}
      aria-hidden="true"
    >
      <div className="font-display text-3xl font-extrabold leading-none tracking-widest">REÇU</div>
      <div className="mt-1 font-mono text-[10px]">{date}</div>
    </div>
  );
}

/* Frise des étapes (reprise de la section Méthode) : la 1re est faite */
function FriseEtapes({ rappel }) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-ink/20" />
      {ETAPES.map((s, i) => (
        <li
          key={s.title}
          className="fade-up relative grid grid-cols-[40px_1fr] gap-4 pb-6 last:pb-0"
          style={{ "--d": `${800 + i * 130}ms` }}
        >
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 bg-ink" style={{ clipPath: HEX }} />
            <div
              className={`absolute inset-[2px] grid place-items-center font-mono text-xs font-semibold ${
                i === 0 ? "bg-brand text-brand-on" : "bg-paper"
              }`}
              style={{ clipPath: HEX }}
            >
              {i === 0 ? <Check size={16} strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
            </div>
          </div>
          <div className={i > 1 ? "opacity-55" : ""}>
            <div className="font-display text-lg font-bold leading-tight">{s.title}</div>
            <div className={`label mt-1 text-[10px] ${i === 0 ? "text-brand-text" : "text-ink/55"}`}>
              {i === 0 ? `Demande reçue · rappel ${rappel}` : s.note}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Réassurance sous le formulaire : badges + avis client lié au service */
function trouverAvis(service) {
  const avis = config.avis || [];
  const mots = SERVICES.find((s) => s.value === service)?.avisMots || [];
  return avis.find((a) => mots.some((m) => (a.visited || "").toLowerCase().includes(m))) || avis[0];
}

function Reassurance({ service }) {
  const avis = trouverAvis(service);
  // Marques de chaudières mises en avant pour les projets de chauffage
  const marques = service === "chauffage" ? config.marques || [] : [];
  return (
    <div className="mt-10 max-w-xl">
      <ul className="flex flex-wrap gap-2">
        {["Gratuit", "Sans engagement", "Rappel sous 24 h"].map((b) => (
          <li
            key={b}
            className="label inline-flex items-center gap-1.5 border border-ink/30 px-2.5 py-1.5 text-[10px] text-ink/70"
          >
            <Check size={12} strokeWidth={3} className="text-brand-text" /> {b}
          </li>
        ))}
      </ul>
      {marques.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <BadgeCheck size={18} strokeWidth={2.2} className="text-brand-text" />
          <span className="text-ink/60">Marques installées :</span>
          {marques.map((m) => (
            <span key={m} className="border-2 border-ink px-2 py-0.5 font-display font-extrabold">
              {m}
            </span>
          ))}
        </div>
      )}
      {avis && (
        <figure className="mt-6 border-l-4 border-brand bg-paper-2 p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <span className="flex text-brand-text" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
            {config.noteGoogle}/5 · {config.nbAvis} avis Google
          </div>
          <blockquote className="mt-2 text-[15px] leading-relaxed text-ink/80">« {avis.text} »</blockquote>
          <figcaption className="label mt-3 text-[10px] text-ink/55">
            {avis.name} · {avis.visited}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

function SimField({ label, value, onChange, type = "text", placeholder, autoComplete, required, error }) {
  return (
    <label className="block">
      <span className="label mb-1 block text-[10px] text-ink/55 sm:mb-2">
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
        aria-invalid={error || undefined}
        className={`field-line text-lg ${error ? "!border-red-700" : ""}`}
      />
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-700">
          Numéro invalide : 10 chiffres, ex. 06 12 34 56 78
        </span>
      )}
    </label>
  );
}
