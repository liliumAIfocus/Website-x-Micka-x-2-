import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./sections/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Tapes from "./sections/Tapes.jsx";
import Services from "./sections/Services.jsx";
import Artisan from "./sections/Artisan.jsx";
import Realisations from "./sections/Realisations.jsx";
import Methode from "./sections/Methode.jsx";
import Zone from "./sections/Zone.jsx";
import Avis from "./sections/Avis.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import MobileBar from "./sections/MobileBar.jsx";
import Simulator from "./Simulator.jsx";
import { useReveal } from "./lib/hooks.js";
import { scrollToHash } from "./lib/scroll.js";

export default function App() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const openSimulator = () => setSimulatorOpen(true);

  useReveal();

  // Les positions des animations au scroll dépendent des polices et des
  // images : on les recalcule une fois tout chargé.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  // Défilement vers une ancre à l'arrivée (ex. lien externe vers /#contact)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = setTimeout(() => scrollToHash(hash, { instant: true }), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <Header onOpenSimulator={openSimulator} />
      <main>
        <Hero onOpenSimulator={openSimulator} />
        <Tapes />
        <Services onOpenSimulator={openSimulator} />
        <Artisan />
        <Realisations onOpenSimulator={openSimulator} />
        <Methode onOpenSimulator={openSimulator} />
        <Zone />
        <Avis />
        <Contact />
      </main>
      <Footer />
      <MobileBar onOpenSimulator={openSimulator} hidden={simulatorOpen} />
      <Simulator open={simulatorOpen} onClose={() => setSimulatorOpen(false)} />
    </div>
  );
}
