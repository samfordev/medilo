import { Injectable } from '@angular/core';
import { CalculationResult, formatNumber, invalidResult } from '../models/calculation-result';

export type InfusionType = 'standard' | 'blood';

export const DRIP_FACTORS: Readonly<Record<InfusionType, number>> = {
  standard: 20,
  blood: 15,
};

const MAX_SAFE_RESULT = Number.MAX_SAFE_INTEGER;

@Injectable({ providedIn: 'root' })
export class DripRateCalculatorService {
  calculate(volumeMl: number, durationMinutes: number, type: InfusionType): CalculationResult {
    if (!Number.isFinite(volumeMl) || volumeMl <= 0 || volumeMl > MAX_SAFE_RESULT) {
      return invalidResult('gouttes/min', 'Le volume doit être strictement supérieur à zéro.');
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > MAX_SAFE_RESULT) {
      return invalidResult('gouttes/min', 'La durée totale doit être strictement supérieure à zéro.');
    }

    const rawValue = (volumeMl * DRIP_FACTORS[type]) / durationMinutes;
    if (!Number.isFinite(rawValue) || rawValue > MAX_SAFE_RESULT) {
      return invalidResult('gouttes/min', 'Le résultat dépasse la plage de calcul fiable.');
    }

    return {
      rawValue,
      displayValue: formatNumber(Math.round(rawValue), 0),
      unit: 'gouttes/min',
      valid: true,
      error: null,
    };
  }
}
