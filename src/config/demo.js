/**
 * ============================================================================
 *  CONFIG DÉMO NEUTRE — NE PAS ÉDITER
 * ============================================================================
 *  Ce fichier contient les valeurs de la démo générique (artisan fictif).
 *  Il sert de :
 *    1. référence de tous les champs disponibles ;
 *    2. sauvegarde pour "réinitialiser" une personnalisation ratée.
 *
 *  Pour personnaliser le site d'un artisan, N'ÉDITE PAS ce fichier :
 *  ouvre plutôt `src/config/artisan.js`.
 *
 *  Compatible avec la config du design 1 : un `artisan.js` du 1er site peut
 *  être recopié tel quel ici. Les champs propres à ce design sont marqués
 *  « (design 2) » et ont tous une valeur par défaut.
 *
 *  Les icônes sont référencées par leur NOM (chaîne de caractères).
 *  Noms disponibles : Droplets, Flame, Zap, Bath, Wrench, ShieldCheck,
 *  Award, Star, MapPin. (voir la table ICONS dans src/lib/icons.jsx)
 *  Les images sont des URL (ici Unsplash, libres) ou des imports d'assets
 *  locaux (voir artisan.js pour un exemple avec de vraies photos).
 * ============================================================================
 */

export const demo = {
  /* ----------------------------- IDENTITÉ ------------------------------- */
  nomEntreprise: "Duval Plomberie",
  nomGerant: "Thomas Duval",
  // Petite ligne sous le portrait (métiers de l'artisan)
  metierLignes: "Plombier · Chauffagiste · Électricien",
  // (design 2) Initiales du logo carré. Laisse à null pour les calculer
  // automatiquement depuis le nom de l'entreprise ("Duval Plomberie" → "DP").
  monogramme: null,

  // Contact
  tel: "01 23 45 67 89", // affiché à l'écran
  telLien: "0123456789", // version sans espaces pour le lien "tel:"
  email: "contact@duval-plomberie.fr",

  // Localisation
  ville: "Villeneuve", // commune de l'artisan
  codePostal: "00000",
  villeProche: "Villeneuve", // grande ville de référence (rayon d'intervention)
  rayonKm: 30, // rayon d'intervention en km
  zoneIntervention: "Villeneuve et sa région", // phrase (utilisée dans le simulateur)
  adressePostale: "1 rue de l'Exemple, 00000 Villeneuve", // mentions légales
  // (design 2) Communes affichées sur la carte « zone d'intervention »
  // (6 à 8 idéalement). Tableau vide = la carte n'affiche que le rayon.
  communes: [
    "Saint-Martin",
    "Beaulieu",
    "Montfort",
    "Les Aulnes",
    "Val-Fleuri",
    "Bellevue",
    "La Garenne",
  ],

  // (design 2) Horaires. `plages` sert à l'indicateur « Disponible
  // maintenant » : jour (0 = dimanche … 6 = samedi) → [heure début, heure fin].
  horaires: {
    texte: "Lun – Ven · 8 h – 19 h  /  Sam · 9 h – 12 h",
    plages: {
      1: [8, 19],
      2: [8, 19],
      3: [8, 19],
      4: [8, 19],
      5: [8, 19],
      6: [9, 12],
    },
  },
  // (design 2) true = hors horaires, le site affiche « Urgences 24 h/24 ».
  urgence24h: true,

  // Légal
  siren: "000 000 000",
  assurance: "Garantie décennale professionnelle",

  /* ------------------------------ MARQUE -------------------------------- */
  // Pour changer la couleur dominante du site, ajuste ces 4 nuances,
  // de la plus claire à la plus foncée. (défaut = bleu azur)
  // Le site calcule tout seul des variantes lisibles (texte sur fond clair,
  // sur fond sombre, texte posé sur la couleur) : n'importe quelle teinte
  // fonctionne, claire ou foncée.
  couleurs: {
    brand: "#1E6FE8", // couleur principale
    brandLight: "#3B82F0", // survols / états clairs
    brandGlow: "#BFD8FB", // reflets
    brandDeep: "#1553B8", // éléments foncés
  },

  // Note Google (affichage)
  noteGoogle: "4,7",
  noteSurCinq: "4,7/5",
  nbAvis: 24,
  // (design 2) Lien vers la fiche Google de l'artisan (bouton « Voir tous les
  // avis »). null = bouton masqué.
  lienAvisGoogle: null,

  /* ------------------------------ MÉDIAS -------------------------------- */
  // Vidéo du hero (facultatif). Laisse à null pour garder l'image ci-dessous.
  // Si renseigné : fichier placé dans public/ (ex. "/hero.mp4"). Dans ce
  // design, la vidéo est affichée dans le cadre vertical du hero : privilégie
  // une vidéo verticale (la version mobile suffit souvent pour les deux).
  heroVideoDesktop: null,
  heroVideoMobile: null,
  // Image du cadre principal du hero (format vertical idéalement)
  hero:
    "https://images.unsplash.com/photo-1782805153036-cb179bde2c4c?auto=format&fit=crop&w=1200&q=80",
  // (design 2) Légende sous l'image du hero
  heroLegende: "Salle de bain rénovée de A à Z : douche d'angle, meuble vasque et WC",
  // Portrait de l'artisan (photo stock pour la démo)
  portrait:
    "https://images.unsplash.com/photo-1646227655685-a530813759b3?auto=format&fit=crop&w=800&q=80",
  // Cadrage du portrait (la photo est recadrée en 4/5). Ajuste le 2e
  // pourcentage pour remonter/descendre le visage : "center 10%" = haut de
  // l'image, "center 50%" = milieu.
  portraitPosition: "center 40%",

  /* ------------------------------ CONTENU ------------------------------- */
  // Accueil (hero) : titre en deux parties, la 2e est dans la couleur de marque.
  hero_titre: "Réparer, rénover,",
  hero_titre_fin: "sans mauvaise surprise.",
  hero_sous_titre:
    "Plomberie, chauffage, salle de bain : un artisan local qui répond au téléphone, annonce ses prix avant de commencer et laisse le chantier propre.",

  // (design 2) Citation de l'artisan (section « L'artisan »)
  citation:
    "Je travaille chez vous comme je travaillerais chez moi : proprement, sans surprise, et en vous expliquant ce que je fais.",
  // (design 2) Courte présentation sous la citation
  presentation:
    "Un seul interlocuteur du premier appel aux finitions. Pas de sous-traitance cachée, pas de devis flou : vous savez qui vient, quand, et pour quel prix.",

  // Prestations (section services)
  services: [
    {
      icon: "Droplets",
      title: "Plomberie",
      desc: "Installation, rénovation et dépannage réactif — sanitaires, canalisations, robinetterie, adoucisseur d'eau et débouchage.",
    },
    {
      icon: "Flame",
      title: "Chauffage",
      desc: "Chaudière gaz ou fioul et radiateurs électriques. Entretien annuel et remplacement de chaudière.",
    },
    {
      icon: "Zap",
      title: "Électricité",
      desc: "Mise aux normes, tableaux électriques et installation de VMC.",
    },
    {
      icon: "Bath",
      title: "Rénovation salle de bain",
      desc: "Projet clé en main réalisé suivant vos goûts : carrelage, robinetterie, électricité et évacuation.",
    },
    {
      icon: "Wrench",
      title: "Dépannage d'urgence",
      desc: "Fuite, panne de chauffage, panne d'eau chaude — intervention rapide dans tout le secteur.",
    },
    {
      icon: "ShieldCheck",
      title: "Mise aux normes",
      desc: "Diagnostic, sécurisation électrique, conformité gaz — un logement rassurant et assurable.",
    },
  ],

  // Chiffres clés (compteurs animés)
  stats: [
    { value: 10, suffix: "+", label: "années d'expérience", icon: "Award" },
    { value: 300, suffix: "+", label: "chantiers menés à bien", icon: "Wrench" },
    { value: 4.7, suffix: "/5", decimals: 1, label: "de moyenne sur les avis Google", icon: "Star" },
  ],

  // Réalisations (galerie de chantiers) — photos stock pour la démo
  chantiers: [
    {
      src: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=900&q=80",
      alt: "Salle de bain complète : baignoire, meuble vasque bois et grand miroir",
    },
    {
      src: "https://images.unsplash.com/photo-1696987007764-7f8b85dd3033?auto=format&fit=crop&w=900&q=80",
      alt: "Douche à l'italienne, double vasque et WC suspendu",
    },
    {
      src: "https://images.unsplash.com/photo-1587527901949-ab0341697c1e?auto=format&fit=crop&w=900&q=80",
      alt: "Douche vitrée et WC, finitions marbre",
    },
    {
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
      alt: "Salle de bain claire : douche, baignoire et WC",
    },
    {
      src: "https://images.unsplash.com/photo-1629079447777-1e605162dc8d?auto=format&fit=crop&w=900&q=80",
      alt: "Salle d'eau lumineuse : vasque, douche et WC",
    },
    {
      src: "https://images.unsplash.com/photo-1643949719317-4342d8d4031e?auto=format&fit=crop&w=900&q=80",
      alt: "Baignoire et vasque, carrelage gris contemporain",
    },
  ],

  // Avis clients (génériques pour la démo — à remplacer par les vrais avis
  // Google de l'artisan lors de la personnalisation)
  avis: [
    {
      name: "Sophie L.",
      initial: "S",
      when: "il y a 2 mois",
      visited: "Rénovation salle de bain",
      text: "Travail soigné et propre, chantier livré dans les temps. Un artisan à l'écoute qui a su me conseiller. Je recommande sans hésiter.",
    },
    {
      name: "Marc D.",
      initial: "M",
      when: "il y a 5 mois",
      visited: "Dépannage plomberie",
      text: "Intervention rapide pour une fuite un dimanche. Très professionnel, tarif clair annoncé à l'avance. Rien à redire.",
    },
    {
      name: "Camille R.",
      initial: "C",
      when: "il y a un an",
      visited: "Remplacement chaudière",
      text: "Remplacement de ma chaudière du diagnostic à la mise en service. Explications claires, travail impeccable et prix respecté.",
    },
  ],
};

export default demo;
