# Personnaliser le site pour un artisan

Ce projet est un **template réutilisable** (design 2 « Atelier »). Tout ce qui
change d'un artisan à l'autre (textes, coordonnées, couleurs, photos, avis,
horaires, communes) se pilote depuis **un seul fichier** :
[`src/config/artisan.js`](src/config/artisan.js).

La démo neutre (artisan fictif « Duval Plomberie ») sert de point de départ et
de référence. Tous les champs disponibles sont listés et commentés dans
[`src/config/demo.js`](src/config/demo.js).

> **Compatible design 1** : un `artisan.js` déjà rempli pour le design 1 peut
> être recopié tel quel ici. Il suffit ensuite de compléter les champs marqués
> « (design 2) » (tous facultatifs, ils ont une valeur par défaut).

---

## Démarrer le site en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5174

---

## Checklist « nouveau prospect » (~10 min)

1. **Ouvrir `src/config/artisan.js`** et renseigner les champs (décommenter les
   lignes voulues) :
   - Identité : `nomEntreprise`, `nomGerant`, `metierLignes`
     (+ `monogramme` si les initiales calculées ne conviennent pas)
   - Contact : `tel`, `telLien` (sans espaces), `email`
   - Localisation : `ville`, `codePostal`, `villeProche`, `rayonKm`,
     `zoneIntervention`, `adressePostale`, `communes` (carte de la zone)
   - Horaires : `horaires.texte` (affiché) et `horaires.plages` (pour
     l'indicateur « Disponible maintenant »), `urgence24h`
   - Légal : `siren`, `assurance`

2. **Couleur** (facultatif) : modifier le bloc `couleurs` (4 nuances, de la plus
   claire à la plus foncée). N'importe quelle teinte marche, même très claire :
   le site calcule automatiquement une version lisible pour le texte sur fond
   clair, sur fond sombre, et la couleur du texte posé sur la couleur.

3. **Photos** : déposer les fichiers dans `src/assets/artisan/`, les importer en
   haut de `artisan.js`, puis renseigner :
   - `hero` : la photo du cadre d'accueil (**format vertical** idéalement) et sa
     légende `heroLegende`
   - `portrait` : la tête de l'artisan (+ `portraitPosition` pour le cadrage)
   - `chantiers` : jusqu'à 6 photos de réalisations (avec un `alt` descriptif,
     affiché en légende)
   - `heroVideoDesktop` / `heroVideoMobile` : (facultatif) vidéo dans le cadre
     du hero, fichier placé dans `public/` (ex. `"/hero.mp4"`)

   Exemple :
   ```js
   import portraitArtisan from "../assets/artisan/portrait.webp";
   // …
   portrait: portraitArtisan,
   ```

4. **Textes** : `hero_titre` / `hero_titre_fin` (la fin s'affiche dans la
   couleur de marque), `hero_sous_titre`, `citation` (la phrase de l'artisan)
   et `presentation`.

5. **Avis** : remplacer le tableau `avis` par les **vrais avis Google** de
   l'artisan (`noteGoogle`, `noteSurCinq`, `nbAvis` en cohérence). Renseigner
   `lienAvisGoogle` pour afficher le bouton « Voir tous les avis ».

6. **SEO** : dans [`index.html`](index.html), adapter le `<title>` et la
   `<meta name="description">` (nom + métiers + ville de l'artisan).

7. Vérifier le rendu avec `npm run dev`, puis publier (voir plus bas).

---

## Règles importantes

- **Ne jamais réutiliser les vraies données d'un autre client** (photos de
  chantiers, avis nominatifs, coordonnées). Chaque site ne contient que les
  données de SON artisan, ou des photos stock libres de droits pour la démo.
- La démo neutre utilise des images Unsplash (libres). Pour un site livré,
  privilégier les vraies photos de l'artisan.
- Les formulaires (contact et simulateur) sont en mode démo : ils affichent une
  confirmation mais n'envoient rien. Les brancher (email, Formspree, etc.)
  avant une mise en ligne réelle.

---

## Publier en ligne

```bash
npm run build
```

Le site statique est généré dans `dist/`. Il peut être déployé sur n'importe quel
hébergeur statique (Vercel, Netlify, etc.). `vercel.json` gère déjà les routes
des pages légales.
