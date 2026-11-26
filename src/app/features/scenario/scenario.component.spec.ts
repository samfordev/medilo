import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { ScenarioComponent } from './scenario.component';

describe('ScenarioComponent', () => {
  afterEach(() => localStorage.removeItem('medilo-scenarios-v1'));

  it('calculates, recalculates and blocks dependent results when an input is invalid', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const template = [...host.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Préparation et débit'));
    template?.click();
    fixture.detectChanges();

    async function set(id: string, value: string) {
      const input = host.querySelector(`#value-${id}`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    await set('prescribed', '500');
    await set('available', '1000');
    await set('reconstitution', '10');
    await set('final-volume', '100');
    await set('duration', '2');
    await set('factor', '20');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('17 gouttes/min');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('50 ml/h');
    const saved = JSON.parse(localStorage.getItem('medilo-scenarios-v1') ?? '{}');
    expect(saved.history[0].steps.find((step: { id: string }) => step.id === 'duration').value).toBe('2');

    await set('duration', '4');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('25 ml/h');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('8 gouttes/min');
    await set('duration', '0');
    expect(host.querySelector('.scenario-summary .result-card')).toBeNull();
    expect(host.querySelector('#value-duration')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('persists favorites locally and reports corrupted saved data', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    [...host.querySelectorAll('button')].find((button) => button.textContent?.includes('Calcul d’une concentration'))?.click();
    fixture.detectChanges();
    [...host.querySelectorAll('button')].find((button) => button.textContent?.includes('Ajouter aux favoris'))?.click();
    fixture.detectChanges();
    expect(JSON.parse(localStorage.getItem('medilo-scenarios-v1') ?? '{}').favorites).toHaveLength(1);
    fixture.destroy();
    const restored = TestBed.createComponent(ScenarioComponent);
    restored.detectChanges();
    expect((restored.nativeElement as HTMLElement).textContent).toContain('Favoris');
    restored.destroy();
    localStorage.setItem('medilo-scenarios-v1', '{bad json');
    const corrupt = TestBed.createComponent(ScenarioComponent);
    corrupt.detectChanges();
    expect((corrupt.nativeElement as HTMLElement).querySelector('[role="alert"]')?.textContent)
      .toContain('Impossible de lire');
    expect(localStorage.getItem('medilo-scenarios-v1')).toBe('{bad json');
  });

  it('prevents invalid reordering and reports a deleted dependency', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    [...host.querySelectorAll('button')].find((button) => button.textContent?.includes('Calcul d’une concentration'))?.click();
    fixture.detectChanges();
    const concentration = host.querySelectorAll('.scenario-step')[2] as HTMLElement;
    expect((concentration.querySelector('[aria-label="Monter Concentration"]') as HTMLButtonElement).disabled).toBe(true);

    const quantity = host.querySelectorAll('.scenario-step')[0] as HTMLElement;
    [...quantity.querySelectorAll('button')].find((button) => button.textContent?.includes('Supprimer'))?.click();
    fixture.detectChanges();
    const remaining = host.querySelectorAll('.scenario-step')[1] as HTMLElement;
    expect(remaining.textContent).toContain('Les opérandes doivent être des étapes précédentes valides');
    expect(remaining.textContent).toContain('Source indisponible');
    expect(host.querySelector('.scenario-summary .result-card')).toBeNull();
  });
});
