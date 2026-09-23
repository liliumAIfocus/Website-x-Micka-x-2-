import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import { config } from "./config/artisan.js";
import { applyBrandColors } from "./config/theme.js";

// Couleurs de la config (src/config/artisan.js) → variables CSS, avant le
// premier affichage et pour toutes les pages.
applyBrandColors(config.couleurs);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/confidentialite" element={<Privacy />} />
      <Route path="/mentions-legales" element={<Terms />} />
    </Routes>
  </BrowserRouter>
);
