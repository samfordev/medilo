import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { afterEach, describe, expect, it } from 'vitest';
import { ScenarioStep } from '../../core/models/scenario';
import { createScenarioTemplate, ScenarioTemplateId } from '../../core/models/scenario-templates';
import { ScenarioComponent } from './scenario.component';

describe('ScenarioComponent', () => {
  afterEach(() => localStorage.removeItem('medilo-scenarios-v1'));

  async function loadTemplate(fixture: ComponentFixture<ScenarioComponent>, id: ScenarioTemplateId) {
    const host = fixture.nativeElement as HTMLElement;
    const select = host.querySelector('#scenario-template') as HTMLSelectElement;
    select.value = id;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    (host.querySelector('[aria-label="Charger"]') as HTMLButtonElement).click();
    fixture.detectChanges();
  }

  it('calculates, recalculates and blocks dependent results when an input is invalid', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'infusion');

    async function set(id: string, value: string) {
      const input = host.querySelector(`#value-${id}`) as HTMLInputElement;
      const step = input.closest('.scenario-step')!;
      const toggle = step.querySelector('.step-toggle') as HTMLButtonElement;
      if (toggle.getAttribute('aria-expanded') === 'false') toggle.click();
      fixture.detectChanges();
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
    const flowToggle = host.querySelector('#step-details-flow')!.parentElement!.querySelector('.step-toggle')!;
    expect(flowToggle.querySelector('.step-value')?.textContent).toContain('50 ml/h');
    const saved = JSON.parse(localStorage.getItem('medilo-scenarios-v1') ?? '{}');
    expect(saved.history[0].steps.find((step: { id: string }) => step.id === 'duration').value).toBe('2');

    await set('duration', '4');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('25 ml/h');
    expect(flowToggle.querySelector('.step-value')?.textContent).toContain('25 ml/h');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('8 gouttes/min');
    await set('duration', '0');
    expect(host.querySelector('.scenario-summary .result-card')).toBeNull();
    expect(flowToggle.querySelector('.step-value')).toBeNull();
    expect(host.querySelector('#value-duration')?.getAttribute('aria-invalid')).toBe('true');
    expect(host.querySelector('#value-duration')?.closest('.scenario-step')?.querySelector('.step-status')?.textContent)
      .toContain('À corriger');
  });

  it('persists favorites locally and reports corrupted saved data', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'concentration');
    (host.querySelector('[aria-label="Ajouter aux favoris"]') as HTMLButtonElement).click();
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

  it('opens and deletes individual favorites from the table', async () => {
    const concentration = createScenarioTemplate('concentration');
    const duration = createScenarioTemplate('duration');
    localStorage.setItem('medilo-scenarios-v1', JSON.stringify({ history: [concentration], favorites: [concentration, duration] }));
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    let rows = host.querySelectorAll('.favorites-table tbody tr');
    expect(rows).toHaveLength(2);
    (rows[1].querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((host.querySelector('#scenario-name') as HTMLInputElement).value).toBe(duration.name);

    const removeFavorite = host.querySelector('[aria-label="Supprimer le favori Calcul d’une concentration"]') as HTMLButtonElement;
    expect(removeFavorite.querySelector('svg')).not.toBeNull();
    removeFavorite.click();
    fixture.detectChanges();
    rows = host.querySelectorAll('.favorites-table tbody tr');
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain(duration.name);
    const saved = JSON.parse(localStorage.getItem('medilo-scenarios-v1') ?? '{}');
    expect(saved.favorites.map((item: { name: string }) => item.name)).toEqual([duration.name]);
    expect(saved.history.some((item: { name: string }) => item.name === concentration.name)).toBe(true);
  });

  it('prevents invalid reordering and reports a deleted dependency', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'concentration');
    const concentration = host.querySelectorAll('.scenario-step')[2] as HTMLElement;
    expect((concentration.querySelector('[aria-label="Monter Concentration"]') as HTMLButtonElement).disabled).toBe(true);

    const quantity = host.querySelectorAll('.scenario-step')[0] as HTMLElement;
    (quantity.querySelector('[aria-label="Supprimer Quantité"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    const remaining = host.querySelectorAll('.scenario-step')[1] as HTMLElement;
    expect(remaining.textContent).toContain('Les opérandes doivent être des étapes précédentes valides');
    expect(remaining.textContent).toContain('Source indisponible');
    expect(host.querySelector('.scenario-summary .result-card')).toBeNull();
  });

  it('lets users move, duplicate and delete collapsed steps from their headers', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'concentration');
    let steps = host.querySelectorAll('.scenario-step');
    expect(steps[0].querySelector('.step-toggle')?.getAttribute('aria-expanded')).toBe('false');
    (steps[0].querySelector('[aria-label="Descendre Quantité"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    steps = host.querySelectorAll('.scenario-step');
    expect(steps[0].querySelector('.step-toggle')?.textContent).toContain('Volume');
    (steps[1].querySelector('[aria-label="Monter Quantité"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    steps = host.querySelectorAll('.scenario-step');
    expect(steps[0].querySelector('.step-toggle')?.textContent).toContain('Quantité');
    (steps[0].querySelector('[aria-label="Dupliquer Quantité"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    steps = host.querySelectorAll('.scenario-step');
    expect(steps).toHaveLength(4);
    expect(steps[1].querySelector('.step-toggle')?.getAttribute('aria-expanded')).toBe('false');
    (steps[1].querySelector('[aria-label="Supprimer Quantité (copie)"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.querySelectorAll('.scenario-step')).toHaveLength(3);
    expect(host.querySelector('.step-toggle')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('reorders dragged steps, persists them and rejects dependency-breaking or outside drops', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'infusion');
    const list = fixture.debugElement.query(By.directive(CdkDropList)).injector.get(CdkDropList<readonly ScenarioStep[]>);
    const drag = fixture.debugElement.queryAll(By.directive(CdkDrag))[0].injector.get(CdkDrag<ScenarioStep>);
    const event: CdkDragDrop<readonly ScenarioStep[], readonly ScenarioStep[], ScenarioStep> = {
      previousIndex: 0, currentIndex: 4, item: drag, container: list, previousContainer: list,
      isPointerOverContainer: true, distance: { x: 0, y: 100 }, dropPoint: { x: 0, y: 100 },
      event: new MouseEvent('mouseup'),
    };
    expect(list.sortPredicate(4, drag, list)).toBe(true);
    expect(list.sortPredicate(7, drag, list)).toBe(false);
    list.dropped.emit(event);
    fixture.detectChanges();
    expect(host.querySelectorAll('.scenario-step')[4].querySelector('.step-toggle')?.textContent).toContain('Quantité prescrite');
    const saved = JSON.parse(localStorage.getItem('medilo-scenarios-v1') ?? '{}');
    expect(saved.history[0].steps[4].id).toBe('prescribed');

    list.dropped.emit({ ...event, previousIndex: 4, currentIndex: 7 });
    list.dropped.emit({ ...event, previousIndex: 4, currentIndex: 0, isPointerOverContainer: false });
    fixture.detectChanges();
    expect(host.querySelectorAll('.scenario-step')[4].querySelector('.step-toggle')?.textContent).toContain('Quantité prescrite');
  });

  it('starts steps collapsed and preserves their contents when toggled', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'concentration');
    const steps = host.querySelectorAll('.scenario-step');
    const toggle = steps[0].querySelector('.step-toggle') as HTMLButtonElement;
    const details = steps[0].querySelector('#step-details-quantity') as HTMLElement;
    expect([...steps].every((step) => step.querySelector('.step-toggle')?.getAttribute('aria-expanded') === 'false')).toBe(true);
    expect(details.hidden).toBe(true);
    expect(toggle.textContent).toContain('À remplir');

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(details.hidden).toBe(false);
    const input = details.querySelector('#value-quantity') as HTMLInputElement;
    input.value = '10';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(toggle.textContent).not.toContain('À corriger');
    expect(toggle.textContent).not.toContain('À remplir');
    expect(toggle.querySelector('.step-value')).toBeNull();
    toggle.click();
    fixture.detectChanges();
    expect(details.hidden).toBe(true);
    expect(toggle.querySelector('.step-value')?.textContent).toContain('10 mg');
    toggle.click();
    fixture.detectChanges();
    expect(input.value).toBe('10');
    expect(steps[1].querySelector('.step-toggle')?.getAttribute('aria-expanded')).toBe('false');

    await loadTemplate(fixture, 'concentration');
    expect(host.querySelector('.step-toggle')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('distinguishes an empty input from an invalid value', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'concentration');
    const step = host.querySelector('.scenario-step')!;
    const status = () => step.querySelector('.step-status')?.textContent?.trim();
    expect(status()).toBe('À remplir');
    const input = step.querySelector('input[inputmode="decimal"]') as HTMLInputElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(status()).toBe('À corriger');
    input.value = '   ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(status()).toBe('À remplir');
  });

  it('shows a zero value for a collapsed generic input', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    [...host.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Valeur')!.click();
    fixture.detectChanges();
    const toggle = host.querySelector('.step-toggle') as HTMLButtonElement;
    expect(toggle.querySelector('.step-value')).toBeNull();
    toggle.click();
    fixture.detectChanges();
    const input = host.querySelector('.scenario-step input[inputmode="decimal"]') as HTMLInputElement;
    input.value = '0';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    toggle.click();
    fixture.detectChanges();
    expect(toggle.querySelector('.step-value')?.textContent).toContain('0 mg');
  });

  it('rounds collapsed results to two decimals without rounding calculations or details', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    await loadTemplate(fixture, 'concentration');
    for (const [id, value] of [['quantity', '1.2345'], ['volume', '2']]) {
      const input = host.querySelector(`#value-${id}`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    }
    const quantity = host.querySelector('#step-details-quantity')!.closest('.scenario-step')!;
    const concentration = host.querySelector('#step-details-concentration')!.closest('.scenario-step')!;
    expect(quantity.querySelector('.step-value')?.textContent).toContain('1,23 mg');
    expect(concentration.querySelector('.step-value')?.textContent).toContain('0,62 mg/ml');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('0,61725 mg/ml');
    (concentration.querySelector('.step-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(concentration.querySelector('.formula-card')?.textContent).toContain('0,61725 mg/ml');

    const input = host.querySelector('#value-quantity') as HTMLInputElement;
    input.value = '0.001';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(quantity.querySelector('.step-value')?.textContent).toContain('Résultat arrondi : 0 mg');
    expect(host.querySelector('.scenario-summary')?.textContent).toContain('0,0005 mg/ml');
  });

  it('only loads the selected template when requested', async () => {
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('[aria-label="Charger"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    const select = host.querySelector('#scenario-template') as HTMLSelectElement;
    select.value = 'concentration';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((host.querySelector('#scenario-name') as HTMLInputElement).value).toBe('Nouveau scénario');
    expect(button.disabled).toBe(false);
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((host.querySelector('#scenario-name') as HTMLInputElement).value).toBe('Calcul d’une concentration');
    (host.querySelector('[aria-label="Nouveau scénario vierge"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((host.querySelector('#scenario-name') as HTMLInputElement).value).toBe('Nouveau scénario');
    expect(host.querySelectorAll('.scenario-step')).toHaveLength(0);
  });

  it('opens and deletes individual history entries from the table', async () => {
    const concentration = createScenarioTemplate('concentration');
    const duration = createScenarioTemplate('duration');
    localStorage.setItem('medilo-scenarios-v1', JSON.stringify({ history: [concentration, duration], favorites: [] }));
    await TestBed.configureTestingModule({ imports: [ScenarioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ScenarioComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    let rows = host.querySelectorAll('.history-table tbody tr');
    expect(rows).toHaveLength(2);
    (rows[1].querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((host.querySelector('#scenario-name') as HTMLInputElement).value).toBe(duration.name);

    const removeHistory = host.querySelector('[aria-label="Supprimer de l’historique Calcul d’une concentration"]') as HTMLButtonElement;
    expect(removeHistory.querySelector('svg')).not.toBeNull();
    removeHistory.click();
    fixture.detectChanges();
    rows = host.querySelectorAll('.history-table tbody tr');
    expect([...rows].some((row) => row.textContent?.includes(concentration.name))).toBe(false);
    expect([...rows].some((row) => row.textContent?.includes(duration.name))).toBe(true);
    const saved = JSON.parse(localStorage.getItem('medilo-scenarios-v1') ?? '{}');
    expect(saved.history.some((item: { name: string }) => item.name === concentration.name)).toBe(false);
    expect(saved.history.some((item: { name: string }) => item.name === duration.name)).toBe(true);
  });
});
