import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((module) => module.HomeComponent),
    pathMatch: 'full',
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
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((module) => module.AboutComponent),
  },
  { path: '**', redirectTo: '' },
];
