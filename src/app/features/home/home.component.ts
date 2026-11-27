import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HOME_TOOL_ICONS } from '../../core/config/home-tool-icons';

@Component({
  imports: [NgComponentOutlet, RouterLink],
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
          <span class="tool-icon" [style.color]="toolIcons['drip-rate'].color"
            [style.background-color]="toolIcons['drip-rate'].background" aria-hidden="true">
            <ng-container [ngComponentOutlet]="toolIcons['drip-rate'].icon" />
          </span>
          <strong>Débit en gouttes/min</strong>
          <span>Estimez le nombre de gouttes par minute selon le volume et la durée.</span>
        </a>
        <a class="tool-card" routerLink="/flow-rate">
          <span class="tool-icon" [style.color]="toolIcons['flow-rate'].color"
            [style.background-color]="toolIcons['flow-rate'].background" aria-hidden="true">
            <ng-container [ngComponentOutlet]="toolIcons['flow-rate'].icon" />
          </span>
          <strong>Débit en ml/h</strong>
          <span>Convertissez un volume et un temps en débit horaire.</span>
        </a>
        <a class="tool-card" routerLink="/glucose-converter">
          <span class="tool-icon" [style.color]="toolIcons['glucose-converter'].color"
            [style.background-color]="toolIcons['glucose-converter'].background" aria-hidden="true">
            <ng-container [ngComponentOutlet]="toolIcons['glucose-converter'].icon" />
          </span>
          <strong>Conversion de glycémie</strong>
          <span>Convertissez une valeur entre g/L et mmol/L dans les deux sens.</span>
        </a>
        <a class="tool-card" routerLink="/scenario">
          <span class="tool-icon" [style.color]="toolIcons.scenario.color"
            [style.background-color]="toolIcons.scenario.background" aria-hidden="true">
            <ng-container [ngComponentOutlet]="toolIcons.scenario.icon" />
          </span>
          <strong>Calcul multi-étapes</strong>
          <span>Construisez un scénario et reliez plusieurs calculs.</span>
        </a>
        <a class="tool-card" routerLink="/fiches-memo-bio">
          <span class="tool-icon" [style.color]="toolIcons['biological-reference'].color"
            [style.background-color]="toolIcons['biological-reference'].background" aria-hidden="true">
            <ng-container [ngComponentOutlet]="toolIcons['biological-reference'].icon" />
          </span>
          <strong>Fiches mémo bio</strong>
          <span>Consultez les valeurs biologiques usuelles et retrouvez vos favoris.</span>
        </a>
      </div>
    </section>

    <aside class="notice notice--warning">
      <strong>À utiliser avec discernement.</strong>
      Les conventions et résultats doivent être vérifiés selon les protocoles de votre établissement.
    </aside>
  `,
})
export class HomeComponent {
  protected readonly toolIcons = HOME_TOOL_ICONS;
}
