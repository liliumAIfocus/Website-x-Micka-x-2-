import { fileURLToPath } from "node:url";

// Chemin explicite vers la config Tailwind : le site se construit
// correctement quel que soit le dossier depuis lequel on le lance.
export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL("./tailwind.config.js", import.meta.url)) },
    autoprefixer: {},
  },
};
