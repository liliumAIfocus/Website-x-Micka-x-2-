/* Défilement fluide maison (window.scrollTo instantané par frame) —
   fiable et compatible avec ScrollTrigger (sections épinglées), contrairement
   au smooth natif qui se fait interrompre par les animations au scroll. */
export function smoothScrollTo(targetY, duration = 800) {
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (Math.abs(dist) < 2) return;
  const startT = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const p = Math.min((now - startT) / duration, 1);
    window.scrollTo(0, startY + dist * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const HEADER_OFFSET = 72;

/* Défile jusqu'à une ancre ("#avis"). Renvoie false si l'ancre n'existe pas. */
export function scrollToHash(hash, { instant = false } = {}) {
  const target = hash && document.querySelector(hash);
  if (!target) return false;
  const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  if (instant) window.scrollTo(0, y);
  else smoothScrollTo(y);
  return true;
}

/* onClick pour les liens d'ancre internes */
export function onAnchorClick(e, href, after) {
  if (scrollToHash(href)) {
    e.preventDefault();
    after?.();
  }
}
