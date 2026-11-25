# Medilo

Medilo est une application web mobile destinée aux professionnels infirmiers. Elle propose trois outils de calcul utilisables dans le navigateur, sans compte utilisateur, backend ni enregistrement des valeurs saisies.

## Fonctionnalités

- **Débit en gouttes/min** : volume × facteur de chute ÷ durée totale en minutes.
  - Soluté classique : 20 gouttes/ml.
  - Sang et dérivés sanguins : 15 gouttes/ml.
- **Débit en ml/h** : volume × 60 ÷ durée totale en minutes.
- **Conversion de glycémie** : g/L × 5,55 vers mmol/L et mmol/L ÷ 5,55 vers g/L.
- **Repère glycémique** : alertes sous 0,70 g/L et au-dessus de 1,10 g/L, avec une barre situant la valeur sur une échelle en g/L. Les bornes 0,70 et 1,10 sont incluses dans la plage de référence; leurs équivalents utilisés en mmol/L sont 3,885 et 6,105.
- **Interface adaptée au mobile**, avec bascule entre thème clair et thème sombre.
- **PWA** : après le chargement complet initial, l’application et ses calculateurs restent accessibles hors connexion.

Les virgules et les points sont acceptés comme séparateurs décimaux. Les valeurs doivent être positives et valides. Les calculs utilisent les valeurs non arrondies; l’arrondi ne s’applique qu’à l’affichage.

## Démarrage local

Prérequis : Node.js 22 et npm.

```bash
npm install
npm start
```

Ouvrir ensuite `http://localhost:4200`.

## Tests et build

```bash
npm test -- --watch=false
npm run build
```

Le build de production est généré dans `dist/medilo/browser`.

## Structure du projet

- `src/app/core/services/` : règles de calcul et références métier.
- `src/app/features/` : accueil, calculateurs et informations.
- `src/app/app.routes.ts` : routes de l’application.
- `src/styles.scss` : styles et thèmes de l’interface.
- `public/icons/medilo.svg` : symbole vectoriel utilisé dans l’en-tête.
- `public/icons/medilo-horizontal.svg` : logo horizontal pour les supports de communication.
- `public/icons/medilo-1024.png` : icône carrée transparente pour smartphone avec marge de sécurité ; les déclinaisons 180, 192 et 512 px sont utilisées par l’application.
- `public/icons/favicon-32.png` et `public/icons/favicon-48.png` : favicons transparents pour le navigateur.
- `public/manifest.webmanifest` et `ngsw-config.json` : configuration PWA et cache hors connexion.

## PWA et installation

Le site doit être déployé en HTTPS pour permettre l’installation PWA; `localhost` convient au développement. Sur Android, utiliser le menu du navigateur et choisir **Installer l’application** ou **Ajouter à l’écran d’accueil**. Sur iOS/iPadOS, ouvrir le site dans Safari, toucher **Partager**, puis **Sur l’écran d’accueil**.

## Précautions d’utilisation

Les facteurs de perfusion sont des conventions initiales à faire valider par un professionnel de santé avant diffusion. Le repère glycémique et ses alertes sont indicatifs : leur interprétation dépend du contexte clinique et ils ne constituent pas un diagnostic. Vérifier les résultats et les protocoles de l’établissement. Medilo ne remplace ni le jugement clinique ni un dispositif médical validé; la qualification réglementaire doit être examinée avant mise en production.
