import LegalLayout from "../components/LegalLayout.jsx";
import { config } from "../config/artisan.js";

export default function Terms() {
  return (
    <LegalLayout
      tag="Informations légales"
      title="Mentions légales."
      sections={[
        {
          title: "Éditeur",
          body: (
            <p>
              {config.nomEntreprise} — {config.metierLignes}
              <br />
              {config.adressePostale}
              <br />
              Téléphone : {config.tel}
              <br />
              Email : {config.email}
            </p>
          ),
        },
        {
          title: "Identification",
          body: (
            <p>
              SIREN : {config.siren} · {config.assurance}.
            </p>
          ),
        },
        {
          title: "Hébergement",
          body: (
            <p>
              Site hébergé chez un prestataire agréé — coordonnées disponibles sur
              simple demande.
            </p>
          ),
        },
        {
          title: "Propriété intellectuelle",
          body: (
            <p>
              L'ensemble des contenus (textes, photos, code) est la propriété de{" "}
              {config.nomEntreprise}. Toute reproduction sans autorisation est interdite.
            </p>
          ),
        },
      ]}
    />
  );
}
