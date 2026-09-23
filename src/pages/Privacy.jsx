import LegalLayout from "../components/LegalLayout.jsx";
import { config } from "../config/artisan.js";

export default function Privacy() {
  return (
    <LegalLayout
      tag="Vos données"
      title="Politique de confidentialité."
      sections={[
        {
          title: "Collecte des données",
          body: (
            <p>
              {config.nomEntreprise} collecte uniquement les informations que vous
              transmettez volontairement via le formulaire de contact ou le
              simulateur : nom, email, téléphone, code postal, description du projet.
            </p>
          ),
        },
        {
          title: "Utilisation",
          body: (
            <p>
              Ces informations servent exclusivement à répondre à votre demande et
              établir un devis. Elles ne sont jamais revendues ni transmises à des
              tiers.
            </p>
          ),
        },
        {
          title: "Conservation",
          body: (
            <p>
              Vos données sont conservées le temps du chantier et jusqu'à trois ans
              après la dernière intervention, à des fins de garantie décennale et de
              comptabilité.
            </p>
          ),
        },
        {
          title: "Vos droits",
          body: (
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de
              rectification et de suppression de vos données. Pour l'exercer,
              contactez{" "}
              <a href={`mailto:${config.email}`} className="link-fill text-brand-text">
                {config.email}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
