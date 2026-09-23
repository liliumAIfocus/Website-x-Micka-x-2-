import {
  Droplets,
  Flame,
  Zap,
  Bath,
  Wrench,
  ShieldCheck,
  Award,
  Star,
  MapPin,
} from "lucide-react";

/* Table des icônes disponibles (référencées par leur nom dans la config) */
export const ICONS = {
  Droplets,
  Flame,
  Zap,
  Bath,
  Wrench,
  ShieldCheck,
  Award,
  Star,
  MapPin,
};

export function GoogleG({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Google">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.5-1.12 2.77-2.39 3.62v3.01h3.86c2.26-2.09 3.58-5.17 3.58-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.86-3.01c-1.07.72-2.44 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.11C3.26 21.3 7.32 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.26 2.7 1.29 6.62l3.98 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function Stars({ n = 5, size = 16, className = "text-brand" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${n} étoiles sur 5`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
