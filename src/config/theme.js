/**
 * Applique les couleurs de la config aux variables CSS de la page.
 * Chaque couleur est exposée en deux formats :
 *   --brand       : #rrggbb   (pour les SVG, dégradés, bordures)
 *   --brand-rgb   : "r g b"   (pour Tailwind, qui gère l'opacité : bg-brand/20)
 *
 * En plus des 4 nuances de la config, trois variantes sont CALCULÉES pour que
 * le site reste lisible quelle que soit la couleur choisie (claire ou foncée) :
 *   --brand-text   : la couleur assombrie juste ce qu'il faut sur fond clair
 *   --brand-bright : la couleur éclaircie juste ce qu'il faut sur fond marine
 *   --on-brand     : blanc ou encre, pour du texte posé SUR la couleur
 * Changer les couleurs dans la config suffit — aucun autre fichier à toucher.
 */

// Fond clair de référence : le lavis bleu (paper-2), plus exigeant que le
// blanc — un accent lisible dessus l'est aussi sur blanc.
const PAPER = [238, 244, 252]; // #EEF4FC
const INK = [13, 34, 64]; // #0D2240
const WHITE = [255, 255, 255];

// "#1E6FE8" -> [30, 111, 232]
function hexToRgb(hex) {
  const clean = String(hex).replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

const triplet = (rgb) => rgb.map(Math.round).join(" ");
const toHex = (rgb) =>
  "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);

// Rapproche `color` de `towards` par petits pas jusqu'à atteindre le contraste
// voulu sur le fond `bg`.
function readable(color, bg, towards, min) {
  let out = color;
  for (let t = 0; t <= 1 && contrast(out, bg) < min; t += 0.04) {
    out = mix(color, towards, t);
  }
  return out;
}

function setColor(root, cssVar, rgb) {
  root.style.setProperty(cssVar, toHex(rgb));
  root.style.setProperty(`${cssVar}-rgb`, triplet(rgb));
}

export function applyBrandColors(couleurs) {
  if (!couleurs || typeof document === "undefined") return;
  const root = document.documentElement;
  const map = {
    brand: "--brand",
    brandLight: "--brand-light",
    brandGlow: "--brand-glow",
    brandDeep: "--brand-deep",
  };
  Object.entries(map).forEach(([key, cssVar]) => {
    if (couleurs[key]) setColor(root, cssVar, hexToRgb(couleurs[key]));
  });

  if (!couleurs.brand) return;
  const brand = hexToRgb(couleurs.brand);
  setColor(root, "--brand-text", readable(brand, PAPER, INK, 4.5));
  setColor(root, "--brand-bright", readable(brand, INK, PAPER, 5));
  setColor(
    root,
    "--on-brand",
    contrast(brand, WHITE) >= contrast(brand, INK) ? WHITE : INK
  );
}
