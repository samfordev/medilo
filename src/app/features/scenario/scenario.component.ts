import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideArrowDown, LucideArrowUp, LucideCopy, LucideTrash2 } from '@lucide/angular';
import { Scenario, ScenarioOperation, ScenarioStep, ScenarioStepResult, ScenarioUnit } from '../../core/models/scenario';
import { createScenarioTemplate, SCENARIO_TEMPLATES, ScenarioTemplateId } from '../../core/models/scenario-templates';
import { ScenarioExecutionService } from '../../core/services/scenario-execution.service';
import { SCENARIO_UNITS, ScenarioStorageService } from '../../core/services/scenario-storage.service';

interface StepPatch {
  name?: string;
  value?: string;
  unit?: ScenarioUnit;
  operation?: ScenarioOperation;
  left?: string;
  right?: string;
  source?: string;
}

@Component({
  selector: 'app-scenario',
  imports: [FormsModule, LucideArrowDown, LucideArrowUp, LucideCopy, LucideTrash2],
  templateUrl: './scenario.component.html',
  styleUrl: './scenario.component.scss',
})
export class ScenarioComponent {
  protected readonly templates = SCENARIO_TEMPLATES;
  protected readonly units = SCENARIO_UNITS;
  protected readonly operations: ReadonlyArray<{ id: ScenarioOperation; label: string; symbol: string }> = [
    { id: 'add', label: 'Addition', symbol: '+' },
    { id: 'subtract', label: 'Soustraction', symbol: '−' },
    { id: 'multiply', label: 'Multiplication', symbol: '×' },
    { id: 'divide', label: 'Division', symbol: '÷' },
  ];
  protected selectedTemplate: ScenarioTemplateId | '' = '';
  protected scenario: Scenario = { name: 'Nouveau scénario', steps: [] };
  protected results: readonly ScenarioStepResult[] = [];
  protected history: Scenario[] = [];
  protected favorites: Scenario[] = [];
  protected storageError: string | null = null;
  protected readonly expandedSteps = new Set<string>();
  private nextId = 0;
  private activeHistory = false;

  constructor(
    private readonly engine: ScenarioExecutionService,
    private readonly storage: ScenarioStorageService,
  ) {
    const saved = this.storage.read();
    this.history = saved.data.history;
    this.favorites = saved.data.favorites;
    this.storageError = saved.error;
  }

  protected openTemplate(): void {
    if (this.selectedTemplate) this.open(createScenarioTemplate(this.selectedTemplate));
  }

  protected open(scenario: Scenario): void {
    this.recordHistory();
    this.activeHistory = false;
    this.expandedSteps.clear();
    this.scenario = structuredClone(scenario);
    this.recalculate();
  }

  protected toggleStep(id: string): void {
    if (this.expandedSteps.has(id)) this.expandedSteps.delete(id);
    else this.expandedSteps.add(id);
  }

  protected blank(): void {
    this.open({ name: 'Nouveau scénario', steps: [] });
  }

  protected duplicateScenario(): void {
    this.open({ ...this.scenario, name: `${this.scenario.name} (copie)` });
  }

  protected resetValues(): void {
    this.recordHistory();
    this.activeHistory = false;
    this.scenario = {
      ...this.scenario,
      steps: this.scenario.steps.map((step) => step.kind === 'input' ? { ...step, value: '' } : step),
    };
    this.recalculate();
  }

  protected appendTemplate(id: ScenarioTemplateId): void {
    const template = createScenarioTemplate(id);
    let prefix: string;
    do { prefix = `${this.freshId()}-`; }
    while (template.steps.some((step) => this.scenario.steps.some((existing) => existing.id === prefix + step.id)));
    const steps = template.steps.map((step): ScenarioStep => {
      if (step.kind === 'operation') {
        return { ...step, id: prefix + step.id, left: prefix + step.left, right: prefix + step.right };
      }
      if (step.kind === 'conversion' || step.kind === 'display') {
        return { ...step, id: prefix + step.id, source: prefix + step.source };
      }
      return { ...step, id: prefix + step.id };
    });
    this.scenario = { ...this.scenario, steps: [...this.scenario.steps, ...steps] };
    this.recalculate();
  }

  protected rename(name: string): void {
    this.scenario = { ...this.scenario, name };
    this.recordHistory();
  }

  protected changeStep(index: number, patch: StepPatch): void {
    this.scenario = {
      ...this.scenario,
      steps: this.scenario.steps.map((step, position) => position === index ? { ...step, ...patch } : step),
    };
    this.recalculate();
  }

  protected add(kind: ScenarioStep['kind']): void {
    const id = this.freshId();
    let step: ScenarioStep;
    switch (kind) {
      case 'input':
        step = { id, name: 'Valeur', kind, value: '', unit: 'mg' };
        break;
      case 'operation':
        step = { id, name: 'Calcul', kind, operation: 'divide', left: '', right: '', unit: 'mg' };
        break;
      case 'conversion':
      case 'display':
        step = { id, name: kind === 'display' ? 'Résultat intermédiaire' : 'Conversion', kind, source: '', unit: 'mg' };
        break;
    }
    this.scenario = { ...this.scenario, steps: [...this.scenario.steps, step] };
    this.recalculate();
  }

  protected remove(index: number): void {
    this.expandedSteps.delete(this.scenario.steps[index].id);
    this.scenario = { ...this.scenario, steps: this.scenario.steps.filter((_, position) => position !== index) };
    this.recalculate();
  }

  protected duplicateStep(index: number): void {
    const steps = [...this.scenario.steps];
    steps.splice(index + 1, 0, { ...steps[index], id: this.freshId(), name: `${steps[index].name} (copie)` });
    this.scenario = { ...this.scenario, steps };
    this.recalculate();
  }

  protected canMove(index: number, direction: number): boolean {
    const steps = [...this.scenario.steps];
    const target = index + direction;
    if (target < 0 || target >= steps.length) return false;
    [steps[index], steps[target]] = [steps[target], steps[index]];
    return steps.every((step, position) => {
      const dependencies = step.kind === 'operation' ? [step.left, step.right]
        : step.kind === 'conversion' || step.kind === 'display' ? [step.source] : [];
      const originalPosition = this.scenario.steps.findIndex((candidate) => candidate.id === step.id);
      return dependencies.every((id) => {
        const before = this.scenario.steps.findIndex((candidate) => candidate.id === id);
        const after = steps.findIndex((candidate) => candidate.id === id);
        const wasValid = before >= 0 && before < originalPosition;
        return !wasValid || after >= 0 && after < position;
      });
    });
  }

  protected move(index: number, direction: number): void {
    if (!this.canMove(index, direction)) return;
    const steps = [...this.scenario.steps];
    const target = index + direction;
    [steps[index], steps[target]] = [steps[target], steps[index]];
    this.scenario = { ...this.scenario, steps };
    this.recalculate();
  }

  protected saveFavorite(): void {
    if (this.storageError) return;
    this.favorites = [structuredClone(this.scenario), ...this.favorites];
    this.persist();
  }

  protected recordHistory(): void {
    if (this.storageError || this.scenario.steps.length === 0) return;
    this.history = [structuredClone(this.scenario), ...this.history.slice(this.activeHistory ? 1 : 0)].slice(0, 10);
    this.activeHistory = true;
    this.persist();
  }

  protected removeSaved(group: 'history' | 'favorites', index: number): void {
    if (this.storageError) return;
    if (group === 'history') {
      this.history = this.history.filter((_, i) => i !== index);
      if (index === 0) this.activeHistory = false;
    }
    else this.favorites = this.favorites.filter((_, i) => i !== index);
    this.persist();
  }

  protected label(id: string): string {
    const index = this.scenario.steps.findIndex((step) => step.id === id);
    return index < 0 ? 'Étape introuvable' : `${index + 1}. ${this.scenario.steps[index].name}`;
  }

  protected sourceResult(id: string): ScenarioStepResult | undefined {
    return this.results.find((result) => result.stepId === id);
  }

  protected isPrevious(id: string, index: number): boolean {
    return this.scenario.steps.slice(0, index).some((step) => step.id === id);
  }

  protected symbol(operation: ScenarioOperation): string {
    return this.operations.find((candidate) => candidate.id === operation)?.symbol ?? '?';
  }

  protected format(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 12 }).format(value);
  }

  protected rounded(value: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(value));
  }

  protected scenarioHasErrors(): boolean {
    return this.results.some((result) => result.error !== null);
  }

  protected setUnit(index: number, unit: ScenarioUnit): void {
    this.changeStep(index, { unit });
  }

  private freshId(): string {
    let id: string;
    do { id = `step-${++this.nextId}`; }
    while (this.scenario.steps.some((step) => step.id === id));
    return id;
  }

  private recalculate(): void {
    this.results = this.engine.execute(this.scenario);
    this.recordHistory();
  }

  private persist(): void {
    this.storageError = this.storage.write({ history: this.history, favorites: this.favorites });
  }
}
