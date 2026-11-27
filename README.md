# Medilo

Medilo est une application web mobile destinée aux professionnels infirmiers. Elle propose des outils de calcul utilisables dans le navigateur, sans compte utilisateur ni backend.

## Fonctionnalités

- **Débit en gouttes/min** : volume × facteur de chute ÷ durée totale en minutes.
  - Soluté classique : 20 gouttes/ml.
  - Sang et dérivés sanguins : 15 gouttes/ml.
- **Débit en ml/h** : volume × 60 ÷ durée totale en minutes.
- **Conversion de glycémie** : g/L × 5,55 vers mmol/L et mmol/L ÷ 5,55 vers g/L.
- **Calcul multi-étapes** : construction de scénarios à partir de valeurs, opérations, conversions et résultats précédents. Cinq modèles modifiables facilitent les calculs de perfusion.
- **Repère glycémique** : alertes sous 0,70 g/L et au-dessus de 1,10 g/L, avec une barre situant la valeur sur une échelle en g/L. Les bornes 0,70 et 1,10 sont incluses dans la plage de référence; leurs équivalents utilisés en mmol/L sont 3,885 et 6,105.
- **Interface adaptée au mobile**, avec bascule entre thème clair et thème sombre.
- **PWA** : après le chargement complet initial, l’application et ses calculateurs restent accessibles hors connexion.

### Fiches mémo biologiques

Le référentiel local regroupe les catégories Hématologie, Ionogramme et fonction rénale, Gaz du sang artériel, Bilan hépatique, Glycémie/lipides/inflammation/coagulation, Marqueurs cardiaques et musculaires, Bilan thyroïdien, Bilan martial, Équilibre nutritionnel, Analyse urinaire, Bilan endocrinien, Microbiologie, Immunologie et Bilan pancréatique et digestif. La recherche, le filtrage par catégorie et les favoris utilisent ces mêmes données statiques, disponibles hors ligne après chargement de l’application.

Chaque paramètre porte un identifiant stable, une catégorie, un nom, une abréviation, des synonymes, une description, un rôle, une unité, des intervalles de référence, des seuils diagnostiques distincts, des seuils d’alerte, des notes d’interprétation et de prélèvement, des sources et un statut de validation. Les résultats qualitatifs sont décrits séparément et ne reçoivent pas d’intervalles numériques artificiels. Les unités alternatives ne sont renseignées que lorsque leur équivalence est documentée.

Les intervalles de référence, les seuils diagnostiques et les seuils d’alerte sont des notions distinctes. Les nouveaux paramètres sans source médicale vérifiée n’ont pas d’intervalles ni de seuils numériques; les paramètres dépendant de la méthode ou du laboratoire affichent explicitement cette réserve. Les sources sont enregistrées par nom, référence, URL éventuelle et date de vérification; les intervalles futurs doivent être appuyés par des références médicales reconnues et adaptés à la méthode, à la population et au contexte concernés. Les données existantes et nouvelles sont signalées comme non validées médicalement (`to-verify`) tant qu’une revue professionnelle avec références fiables et date de vérification n’a pas été effectuée. L’absence de source dans une fiche ne constitue pas une validation. Toujours privilégier les unités, intervalles et interprétations du laboratoire ayant réalisé l’analyse.

Les virgules et les points sont acceptés comme séparateurs décimaux. Les valeurs doivent être positives et valides. Les calculs utilisent les valeurs non arrondies; l’arrondi ne s’applique qu’à l’affichage.

### Calcul multi-étapes

Pour ajouter une étape ou un calcul médical préconfiguré, choisissez-le dans la liste correspondante puis cliquez sur « Ajouter ». Les étapes sont repliées par défaut ; cliquez sur leur titre pour afficher ou masquer leurs détails. Lorsqu'elles sont repliées, leur résultat valide reste visible. Les icônes de leur en-tête permettent de les déplacer, les dupliquer ou les supprimer ; la poignée permet aussi de les déplacer par glisser-déposer. Les déplacements qui invalideraient une dépendance sont interdits. Elles sont exécutées dans l'ordre : seules les étapes précédentes valides peuvent servir d'opérandes. Les dimensions sont vérifiées avant toute opération. Les conversions reposent sur les unités de base mg, ml, heure et goutte ; le facteur de chute, exprimé en gouttes/ml, doit être saisi pour chaque modèle concerné. Les entrées des modèles médicaux sont strictement positives ; une valeur générique peut être nulle, mais pas négative. Une erreur bloque l'étape et ses dépendants ; la synthèse finale est masquée tant qu'une étape est invalide.

Les résultats des étapes repliées sont arrondis à deux décimales au maximum ; les détails ouverts et la synthèse utilisent au maximum 12 chiffres significatifs. Les calculs suivants utilisent les valeurs non arrondies en virgule flottante JavaScript. Le résultat final en gouttes/min est également affiché arrondi à l'entier le plus proche. Cette arithmétique n'est pas une arithmétique décimale exacte ; les valeurs hors de la plage de calcul acceptée et les sous-flux détectables sont rejetés. Il faut vérifier les résultats, en particulier à proximité d'une limite ou d'un seuil clinique.

Les modèles s'appuient sur les mêmes opérations mathématiques génériques et conversions dimensionnelles que l'éditeur, sans modification des calculateurs existants :

| Modèle | Formules et hypothèses |
| --- | --- |
| Préparation et débit | Concentration reconstituée = quantité disponible ÷ volume de reconstitution ; volume à prélever = quantité prescrite ÷ concentration reconstituée ; concentration finale = quantité prescrite ÷ volume final ; débit = volume final ÷ durée ; gouttes/min = débit ml/h × facteur de chute ÷ 60. Le volume final est le volume total administré. |
| Reconstitution | Concentration = quantité disponible ÷ volume de reconstitution ; volume à prélever = quantité prescrite ÷ concentration. |
| Concentration | Concentration = quantité ÷ volume. |
| Débit en gouttes | Débit en gouttes/min = débit ml/h × facteur de chute ÷ 60. |
| Durée | Durée en heures = volume en ml ÷ débit en ml/h. |

Les modèles ne vérifient ni la faisabilité de la préparation, ni la stabilité, ni les limites de dose, ni la prescription. L'utilisateur doit choisir les volumes appropriés et vérifier le facteur du dispositif utilisé ; aucune valeur n'est universelle.

Choisissez un modèle dans la liste des scénarios, puis cliquez sur « Charger » pour l'ouvrir. Les favoris et les dix derniers scénarios utilisés sont stockés dans le navigateur, avec leurs valeurs, sur l'appareil utilisé. L'historique est mis à jour automatiquement lors de l'édition ; la réinitialisation conserve aussi l'état précédent. Les entrées des tableaux de favoris et des derniers scénarios peuvent être ouvertes ou supprimées individuellement. N'incluez aucun nom, identifiant ou autre information personnelle de patient dans les libellés ou les valeurs : l'application ne peut pas détecter les données personnelles saisies librement. Le stockage peut être inaccessible ou effacé par le navigateur ; son indisponibilité est signalée.

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
