import { Injectable } from '@angular/core';
import { Scenario, ScenarioStep, ScenarioUnit } from '../models/scenario';

export const SCENARIO_UNITS: readonly ScenarioUnit[] = [
  '1', 'mg', 'g', 'µg', 'ml', 'L', 'mg/ml', 'g/L', 'µg/ml',
  'ml/h', 'L/h', 'gouttes/ml', 'gouttes/min', 'min', 'h',
];

interface StoredScenarios {
  history: Scenario[];
  favorites: Scenario[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStep(value: unknown): value is ScenarioStep {
  if (!isRecord(value) || typeof value['id'] !== 'string' || typeof value['name'] !== 'string' ||
      typeof value['unit'] !== 'string' || !SCENARIO_UNITS.some((unit) => unit === value['unit'])) {
    return false;
  }
  switch (value['kind']) {
    case 'input':
      return typeof value['value'] === 'string' &&
        (value['positive'] === undefined || typeof value['positive'] === 'boolean');
    case 'operation':
      return ['add', 'subtract', 'multiply', 'divide'].some((op) => op === value['operation']) &&
        typeof value['left'] === 'string' && typeof value['right'] === 'string';
    case 'conversion':
    case 'display':
      return typeof value['source'] === 'string';
    default:
      return false;
  }
}

function isScenario(value: unknown): value is Scenario {
  return isRecord(value) && typeof value['name'] === 'string' &&
    Array.isArray(value['steps']) && value['steps'].every(isStep);
}

@Injectable({ providedIn: 'root' })
export class ScenarioStorageService {
  private readonly key = 'medilo-scenarios-v1';

  read(): { data: StoredScenarios; error: string | null } {
    const empty: StoredScenarios = { history: [], favorites: [] };
    try {
      const saved = localStorage.getItem(this.key);
      if (saved === null) {
        return { data: empty, error: null };
      }
      const data: unknown = JSON.parse(saved);
      if (!isRecord(data) || !Array.isArray(data['history']) || !data['history'].every(isScenario) ||
          !Array.isArray(data['favorites']) || !data['favorites'].every(isScenario)) {
        return { data: empty, error: 'Les scénarios enregistrés sont illisibles. Ils n’ont pas été modifiés.' };
      }
      return { data: { history: data['history'], favorites: data['favorites'] }, error: null };
    } catch {
      return { data: empty, error: 'Impossible de lire les scénarios enregistrés localement.' };
    }
  }

  write(data: StoredScenarios): string | null {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return null;
    } catch {
      return 'Impossible d’enregistrer les scénarios sur cet appareil.';
    }
  }
}
