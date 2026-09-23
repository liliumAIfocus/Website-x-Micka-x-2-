/** @type {import('tailwindcss').Config} */

// Couleur de marque pilotée par variable CSS (voir src/config/theme.js).
// Le format rgb(var(--x) / <alpha-value>) garde l'opacité Tailwind (bg-brand/20).
const v = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

export default {
  // relative: true → chemins résolus depuis ce fichier, pas depuis le dossier courant
  content: { relative: true, files: ["./index.html", "./src/**/*.{js,jsx}"] },
  theme: {
    extend: {
      colors: {
        // Fond clair (« paper » : blanc + lavis bleu clair) et encre bleu
        // marine (« ink » : texte, blocs sombres, ombres) : la base fixe du design.
        paper: {
          DEFAULT: "#FFFFFF",
          2: "#EEF4FC",
          3: "#DCE8F7",
        },
        ink: {
          DEFAULT: "#0D2240",
          2: "#152E54",
          3: "#1F3C68",
        },
        brand: {
          DEFAULT: v("brand"),
          light: v("brand-light"),
          glow: v("brand-glow"),
          deep: v("brand-deep"),
          // Variantes calculées automatiquement pour rester lisibles :
          text: v("brand-text"), // accent sur fond clair
          bright: v("brand-bright"), // accent sur fond sombre
          on: v("on-brand"), // texte posé SUR la couleur de marque
        },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        body: ["'Instrument Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Ombre « dure » décalée, signature du design
        hard: "6px 6px 0 0 rgb(var(--ink-rgb))",
        "hard-brand": "8px 8px 0 0 rgb(var(--brand-rgb))",
        "hard-sm": "3px 3px 0 0 rgb(var(--ink-rgb))",
      },
      maxWidth: {
        site: "86rem",
      },
    },
  },
  plugins: [],
};
