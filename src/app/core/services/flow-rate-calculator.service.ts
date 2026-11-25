import { Injectable } from '@angular/core';
import { CalculationResult, formatNumber, invalidResult } from '../models/calculation-result';

const MAX_SAFE_RESULT = Number.MAX_SAFE_INTEGER;

@Injectable({ providedIn: 'root' })
export class FlowRateCalculatorService {
  calculate(volumeMl: number, durationMinutes: number): CalculationResult {
    if (!Number.isFinite(volumeMl) || volumeMl <= 0 || volumeMl > MAX_SAFE_RESULT) {
      return invalidResult('ml/h', 'Le volume doit être strictement supérieur à zéro.');
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > MAX_SAFE_RESULT) {
      return invalidResult('ml/h', 'La durée totale doit être strictement supérieure à zéro.');
    }

    const rawValue = (volumeMl * 60) / durationMinutes;
    if (!Number.isFinite(rawValue) || rawValue > MAX_SAFE_RESULT) {
      return invalidResult('ml/h', 'Le résultat dépasse la plage de calcul fiable.');
    }

    return {
      rawValue,
      displayValue: formatNumber(rawValue, 2),
      unit: 'ml/h',
      valid: true,
      error: null,
    };
  }
}
