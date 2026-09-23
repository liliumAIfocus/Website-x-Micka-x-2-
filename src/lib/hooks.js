import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Apparition au scroll : ajoute la classe `is-in` aux éléments [data-reveal]
   quand ils entrent dans l'écran (animation 100 % CSS, voir index.css).
   Un délai peut être passé en style : style={{ "--d": "120ms" }}. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Compteur animé qui démarre quand l'élément devient visible */
export function useCountUp(target, { duration = 1600, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const factor = Math.pow(10, decimals);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * target * factor) / factor);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration, decimals]);
  return [ref, value];
}

/* Détection de swipe horizontal (mobile) — onSwipe(1) = suivant, -1 = précédent */
export function useSwipe(onSwipe) {
  const start = useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!start.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.current.x;
    const dy = t.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) onSwipe(dx < 0 ? 1 : -1);
  };
  return { onTouchStart, onTouchEnd };
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* Disponibilité en temps réel, d'après les horaires de la config.
   → { open: true/false, label: "Disponible maintenant" | … } */
function openStatus(horaires, urgence24h) {
  const now = new Date();
  const plage = horaires?.plages?.[now.getDay()];
  const h = now.getHours() + now.getMinutes() / 60;
  const open = !!plage && h >= plage[0] && h < plage[1];
  if (open) return { open, label: "Disponible maintenant" };
  return {
    open,
    label: urgence24h ? "Urgences 24 h/24" : "Fermé · laissez un message",
  };
}

export function useOpenStatus(horaires, urgence24h) {
  const [status, setStatus] = useState(() => openStatus(horaires, urgence24h));
  useEffect(() => {
    const id = setInterval(() => setStatus(openStatus(horaires, urgence24h)), 60_000);
    return () => clearInterval(id);
  }, [horaires, urgence24h]);
  return status;
}

/* Ajuste la taille de police d'un texte pour qu'il occupe toute la largeur
   de son conteneur (utilisé pour le grand nom en pied de page). */
export function useFitText() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    const fit = () => {
      const cs = getComputedStyle(parent);
      const width =
        parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = "100px";
      const ratio = width / el.scrollWidth;
      el.style.fontSize = `${Math.floor(100 * ratio * 0.99)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);
  return ref;
}
