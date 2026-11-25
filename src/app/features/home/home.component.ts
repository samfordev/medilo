import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  template: `
    <section class="home-hero">
      <div class="page-heading">
        <p class="eyebrow">Votre boîte à outils</p>
        <h1>Les calculs utiles,<br />au même endroit.</h1>
        <p class="page-intro">
          Des outils rapides pour vos calculs de perfusion et la conversion de glycémie.
          Les résultats se mettent à jour dès la saisie.
        </p>
      </div>

      <div class="tool-grid">
        <a class="tool-card" routerLink="/drip-rate">
          <span class="tool-icon" aria-hidden="true">⌁</span>
          <strong>Débit en gouttes/min</strong>
          <span>Estimez le nombre de gouttes par minute selon le volume et la durée.</span>
        </a>
        <a class="tool-card" routerLink="/flow-rate">
          <span class="tool-icon" aria-hidden="true">↗</span>
          <strong>Débit en ml/h</strong>
          <span>Convertissez un volume et un temps en débit horaire.</span>
        </a>
        <a class="tool-card" routerLink="/glucose-converter">
          <span class="tool-icon" aria-hidden="true">◉</span>
          <strong>Conversion de glycémie</strong>
          <span>Convertissez une valeur entre g/L et mmol/L dans les deux sens.</span>
        </a>
      </div>
    </section>

    <aside class="notice notice--warning">
      <strong>À utiliser avec discernement.</strong>
      Les conventions et résultats doivent être vérifiés selon les protocoles de votre établissement.
    </aside>
  `,
})
export class HomeComponent {}
