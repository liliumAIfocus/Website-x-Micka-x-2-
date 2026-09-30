import { config } from "../config/artisan.js";

/* Les 4 étapes de la méthode : section « Méthode » + frise de fin du simulateur */
const prenom = config.nomGerant.split(" ")[0];

export const STEPS = [
  {
    title: "Premier contact",
    note: "Rappel sous 24 h",
    desc: `Vous appelez ou remplissez le simulateur. ${prenom} vous rappelle pour comprendre votre besoin et, si c'est urgent, intervient au plus vite.`,
  },
  {
    title: "Visite & diagnostic",
    note: "Sans engagement",
    desc: "Sur place, on regarde l'existant ensemble : état des réseaux, contraintes du logement, vos envies. Des conseils clairs, sans jargon.",
  },
  {
    title: "Devis détaillé",
    note: "Sous quelques jours",
    desc: "Matériaux, main d'œuvre, planning : tout est écrit noir sur blanc. Le prix annoncé est le prix payé.",
  },
  {
    title: "Chantier & finitions",
    note: config.assurance,
    desc: "Logement protégé, chantier nettoyé chaque soir, finitions vérifiées avec vous avant de partir. Les travaux sont couverts par la garantie décennale.",
  },
];

/* Hexagone façon écrou/raccord, pour les étapes */
export const HEX = "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)";
