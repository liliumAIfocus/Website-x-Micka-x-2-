# Site Artisan — design 2 « Atelier »

Deuxième template de site vitrine pour artisans (plomberie / chauffage /
électricité), volontairement différent du design 1 : fond blanc et bleu clair,
encre bleu marine, accent bleu azur, typographie grasse condensée, angles droits.

React + Vite + Tailwind + GSAP. Le contenu propre à chaque artisan se configure
depuis un seul fichier, **compatible avec la config du design 1**.

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5174 (port différent du design 1 pour pouvoir
lancer les deux en même temps).

## Personnaliser pour un artisan

Tout se passe dans **`src/config/artisan.js`**.
Voir le guide complet : [PERSONNALISATION.md](PERSONNALISATION.md).

## Ce qui fait ce design

- Hero éditorial en deux colonnes, photo encadrée + badge rotatif
- Deux « rubans de chantier » croisés qui défilent (prestations / engagements)
- Prestations en liste numérotée façon sommaire
- Galerie de réalisations **épinglée** qui défile à l'horizontale (ordinateur)
- Méthode : un **tuyau** se remplit au scroll et allume chaque étape
- Carte « radar » de la zone d'intervention avec les communes desservies
- Indicateur « Disponible maintenant » calculé sur les horaires
- Barre d'action fixe Appeler / Devis sur mobile
- Simulateur de devis pilotable au clavier (A, B, C…)
- Couleur de marque au choix : les variantes lisibles sont calculées seules

## Structure

- `src/config/artisan.js` — **config active** (à éditer par artisan)
- `src/config/demo.js` — valeurs de la démo neutre + liste de tous les champs
- `src/config/theme.js` — applique les couleurs (et calcule les contrastes)
- `src/App.jsx` — assemble les sections
- `src/sections/` — une section de la page par fichier
- `src/Simulator.jsx` — assistant de demande de devis
- `src/pages/` — mentions légales & confidentialité
