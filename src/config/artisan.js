/**
 * ============================================================================
 *  CONFIG ACTIVE — MG WORKS (Mickaël Gotorbe)
 * ============================================================================
 *  Design 2 « Atelier » habillé avec les infos de MG Works.
 *  Les textes (hero, citation, présentation, prestations) sont ceux de la
 *  démo 2 : seules les données propres à l'artisan sont renseignées ici.
 *  Tout ce qui n'est pas renseigné reprend la démo (src/config/demo.js).
 *
 *  Voir PERSONNALISATION.md à la racine pour la marche à suivre complète.
 * ============================================================================
 */

import { demo } from "./demo.js";

import portraitArtisan from "../assets/artisan/portrait.webp";
import chantier1 from "../assets/artisan/chantier1.webp";
import chantier2 from "../assets/artisan/chantier2.webp";
import chantier3 from "../assets/artisan/chantier3.webp";
import chantier4 from "../assets/artisan/chantier4.webp";
import chantier5 from "../assets/artisan/chantier5.png";
import chantier6 from "../assets/artisan/chantier6.webp";

export const config = {
  // On part de la démo, et on écrase seulement ce qui change.
  ...demo,

  // ========================= IDENTITÉ =========================
  nomEntreprise: "MG Works",
  nomGerant: "Mickaël Gotorbe",
  metierLignes: "Plombier · Chauffagiste · Électricien",
  monogramme: "MG",

  tel: "07 70 96 56 39",
  telLien: "0770965639",
  email: "mgworkss@gmail.com",

  ville: "Saint-André-les-Vergers",
  codePostal: "10120",
  villeProche: "Troyes",
  rayonKm: 20,
  zoneIntervention: "Troyes et son agglomération",
  adressePostale: "15 rue Marco Polo, 10120 Saint-André-les-Vergers",
  siren: "849 625 454",
  // Noms abrégés façon carte et ordre choisi pour que les libellés du
  // radar ne se chevauchent pas (positions calculées d'après l'index).
  communes: [
    "Bréviandes",
    "Rosières",
    "Pont-Ste-Marie",
    "St-André-les-Vergers",
    "La Chapelle-St-Luc",
    "St-Julien-les-Villas",
    "Sainte-Savine",
    "St-Parres-aux-Tertres",
  ],

  // ========================= HORAIRES =========================
  // Horaires non affichés (remplacés par le numéro dans « Contact »).
  // Les plages de la démo servent encore à l'indicateur « Disponible
  // maintenant » du header : à caler avec Mickaël.
  urgence24h: false,

  // ========================= COULEUR (bleu ciel MG Works) =========================
  couleurs: {
    brand: "#80C0E3",
    brandLight: "#A5D4EE",
    brandGlow: "#C6E5F5",
    brandDeep: "#5A9CC0",
  },

  // ========================= PHOTOS =========================
  hero: chantier1,
  heroLegende: "Salle de bain rénovée : douche à l'italienne, meuble vasque suspendu noir mat et colonne",
  portrait: portraitArtisan,
  portraitPosition: "center 22%",
  chantiers: [
    { src: chantier6, alt: "Salle de bain douce — douche à l'italienne et grand meuble" },
    { src: chantier3, alt: "Meuble vasque noir, miroir rond rétroéclairé et robinetterie dorée" },
    { src: chantier4, alt: "Cabine de douche noire, vasque dorée et carrelage marbré" },
    { src: chantier2, alt: "Douche à l'italienne et baignoire balnéo habillage bois" },
    { src: chantier5, alt: "Baignoire encastrée dans un habillage pierre" },
  ],

  // ========================= CHIFFRES =========================
  stats: [
    { value: 7, suffix: "+", label: "années d'expérience", icon: "Award" },
    { value: 250, suffix: "+", label: "chantiers menés à bien", icon: "Wrench" },
    { value: 5, suffix: "/5", label: "de moyenne sur les avis Google", icon: "Star" },
  ],

  // ========================= AVIS (avis Google de MG Works) =====
  noteGoogle: "5,0",
  noteSurCinq: "5/5",
  nbAvis: 11,
  avis: [
    {
      name: "Vanessa B.",
      initial: "V",
      when: "il y a 11 mois",
      visited: "Rénovation salle de bain",
      text: "Très bonne expérience avec monsieur Godorbe qui a réalisé à mon domicile une rénovation complète de ma salle de bain et une installation d'un chauffe-eau. Travail soigné, propre et livré dans les temps.",
    },
    {
      name: "Nicole L.",
      initial: "N",
      when: "il y a 3 mois",
      visited: "Intervention plomberie",
      text: "Très professionnel et très compétent, ce plombier est intervenu très rapidement. Je suis très satisfaite de ses travaux et je le recommande très sincèrement.",
    },
    {
      name: "Olivier S.",
      initial: "O",
      when: "il y a un an",
      visited: "Dépannage fuite de douche",
      text: "J'ai fait appel à M. Gotorbe pour un problème de bonde de douche qui fuyait, et je suis extrêmement satisfait du service. Le plombier a été très réactif et efficace.",
    },
  ],
};

export default config;
