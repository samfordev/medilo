import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((module) => module.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'fiches-memo',
    loadComponent: () =>
      import('./features/biological-reference/biological-reference.component').then(
        (module) => module.BiologicalReferenceComponent,
      ),
  },
  {
    path: 'fiches-memo/favoris',
    loadComponent: () =>
      import('./features/biological-reference/biological-reference.component').then(
        (module) => module.BiologicalReferenceComponent,
      ),
    data: { view: 'favoris' },
  },
  {
    path: 'fiches-memo/categorie/:categoryId',
    loadComponent: () =>
      import('./features/biological-reference/biological-reference.component').then(
        (module) => module.BiologicalReferenceComponent,
      ),
  },
  {
    path: 'fiches-memo/:parameterId',
    loadComponent: () =>
      import('./features/biological-reference/biological-reference.component').then(
        (module) => module.BiologicalReferenceComponent,
      ),
  },
  {
    path: 'drip-rate',
    loadComponent: () =>
      import('./features/drip-rate/drip-rate.component').then((module) => module.DripRateComponent),
  },
  {
    path: 'flow-rate',
    loadComponent: () =>
      import('./features/flow-rate/flow-rate.component').then((module) => module.FlowRateComponent),
  },
  {
    path: 'glucose-converter',
    loadComponent: () =>
      import('./features/glucose-converter/glucose-converter.component').then(
        (module) => module.GlucoseConverterComponent,
      ),
  },
  {
    path: 'scenario',
    loadComponent: () =>
      import('./features/scenario/scenario.component').then((module) => module.ScenarioComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((module) => module.AboutComponent),
  },
  { path: '**', redirectTo: '' },
];
