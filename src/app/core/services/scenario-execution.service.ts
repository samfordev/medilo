import { Injectable } from '@angular/core';
import { Scenario, ScenarioStep, ScenarioStepResult } from '../models/scenario';
import { parseOptionalNonNegativeNumber } from '../../shared/utils/numeric-input';
import { ScenarioUnitsService } from './scenario-units.service';

@Injectable({ providedIn: 'root' })
export class ScenarioExecutionService {
  constructor(private readonly units: ScenarioUnitsService) {}

  execute(scenario: Scenario): readonly ScenarioStepResult[] {
    const results = new Map<string, ScenarioStepResult>();
    const counts = new Map<string, number>();
    for (const step of scenario.steps) {
      counts.set(step.id, (counts.get(step.id) ?? 0) + 1);
    }
    return scenario.steps.map((step) => {
      let result: ScenarioStepResult;
      if (!step.id || counts.get(step.id) !== 1) {
        result = this.error(step, 'Identifiant d’étape vide ou en double.');
      } else {
        result = this.executeStep(step, results);
      }
      results.set(step.id, result);
      return result;
    });
  }

  private executeStep(step: ScenarioStep, previous: Map<string, ScenarioStepResult>): ScenarioStepResult {
    if (!this.units.compatible(step.unit, step.unit)) {
      return this.error(step, 'Unité inconnue.');
    }
    if (step.kind === 'input') {
      if (!step.value.trim()) {
        return this.error(step, 'La valeur est obligatoire.');
      }
      const parsed = parseOptionalNonNegativeNumber(step.value);
      if (parsed.value === null) {
        return this.error(step, parsed.error ?? 'La valeur est obligatoire.');
      }
      if (parsed.value === 0 && /[1-9]/.test(step.value)) {
        return this.error(step, 'La valeur est trop petite pour être représentée de manière fiable.');
      }
      if (step.positive && parsed.value === 0) {
        return this.error(step, 'La valeur doit être strictement supérieure à zéro.');
      }
      return { stepId: step.id, value: parsed.value, unit: step.unit, error: null };
    }

    if (step.kind === 'conversion' || step.kind === 'display') {
      const source = previous.get(step.source);
      if (!source || source.value === null) {
        return this.error(step, 'La source doit être une étape précédente valide.');
      }
      if (!this.units.compatible(source.unit, step.unit)) {
        return this.error(step, 'Unités incompatibles.');
      }
      const value = this.units.convert(source.value, source.unit, step.unit);
      return value === null
        ? this.error(step, 'Le résultat dépasse la plage de calcul fiable.')
        : { stepId: step.id, value, unit: step.unit, error: null };
    }

    if (step.kind !== 'operation') {
      return this.error(step, 'Type d’étape inconnu.');
    }
    const left = previous.get(step.left);
    const right = previous.get(step.right);
    if (!left || !right || left.value === null || right.value === null) {
      return this.error(step, 'Les opérandes doivent être des étapes précédentes valides.');
    }
    if (!this.units.supportsOperation(step.operation, left.unit, right.unit, step.unit)) {
      return this.error(step, 'Opération ou unités incompatibles.');
    }
    if (step.operation === 'divide' && right.value === 0) {
      return this.error(step, 'Division par zéro impossible.');
    }
    const value = this.units.calculate(step.operation, left.value, left.unit, right.value, right.unit, step.unit);
    return value === null
      ? this.error(step, 'Résultat négatif ou hors de la plage de calcul fiable.')
      : { stepId: step.id, value, unit: step.unit, error: null };
  }

  private error(step: ScenarioStep, error: string): ScenarioStepResult {
    return { stepId: step.id, value: null, unit: step.unit, error };
  }
}
