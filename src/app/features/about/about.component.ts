import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <header class="page-heading">
      <p class="eyebrow">À propos</p>
      <h1>Informations et précautions</h1>
      <p class="page-intro">
        Medilo regroupe des calculateurs simples pour accompagner les professionnels dans leurs calculs.
      </p>
    </header>

    <div class="info-grid">
      <section class="info-card">
        <h2>Formules utilisées</h2>
        <ul>
          <li>Gouttes/min = (volume en ml × facteur) ÷ durée en minutes.</li>
          <li>Débit ml/h = volume en ml × 60 ÷ durée en minutes.</li>
          <li>g/L vers mmol/L : multiplier par 5,55.</li>
          <li>mmol/L vers g/L : diviser par 5,55.</li>
        </ul>
      </section>

      <section class="info-card">
        <h2>Conventions de calcul</h2>
        <ul>
          <li>Solutés classiques : 20 gouttes/ml.</li>
          <li>Sang et dérivés sanguins : 15 gouttes/ml.</li>
          <li>Gouttes/min arrondi à l’entier le plus proche.</li>
          <li>Débits et conversions affichés à deux décimales.</li>
          <li>Repère glycémique : 0,70 à 1,10 g/L, évalué dans l’unité saisie après conversion si nécessaire.</li>
        </ul>
      </section>

      <section class="info-card">
        <h2>Utilisation hors connexion</h2>
        <p>
          Après un premier chargement complet, l’application peut être utilisée hors connexion.
          Sur Android, ouvrez le menu du navigateur et choisissez « Installer l’application » ou
          « Ajouter à l’écran d’accueil ». Sur iPhone/iPad, ouvrez Medilo dans Safari, touchez
          « Partager », puis « Sur l’écran d’accueil ».
        </p>
      </section>

      <section class="info-card">
        <h2>Précautions importantes</h2>
        <p>
          Les facteurs indiqués sont des conventions initiales et doivent être validés par un
          professionnel de santé avant toute diffusion. Vérifiez chaque résultat et les protocoles
          de votre établissement. Medilo ne remplace ni le jugement clinique ni les dispositifs
          médicaux validés. La qualification réglementaire doit être examinée avant mise en production.
        </p>
        <p>
          Les alertes de glycémie sont indicatives, dépendent du contexte clinique et ne constituent
          pas un diagnostic.
        </p>
        <p>Aucune donnée saisie n’est enregistrée ou transmise par l’application.</p>
      </section>
    </div>
    <p class="about-version">Version 1.0.0 · Application web progressive</p>
  `,
})
export class AboutComponent {}
