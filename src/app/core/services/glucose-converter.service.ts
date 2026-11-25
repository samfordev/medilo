import { Injectable } from '@angular/core';
import { CalculationResult, formatNumber, invalidResult } from '../models/calculation-result';

export type GlucoseUnit = 'g/L' | 'mmol/L';

export const GLUCOSE_CONVERSION_FACTOR = 5.55;
export const GLUCOSE_REFERENCE_RANGE_G_PER_L = {
  minimum: 0.7,
  maximum: 1.1,
} as const;

export type GlucoseRangeStatus = 'low' | 'normal' | 'high';

export function classifyGlucoseValue(value: number, unit: GlucoseUnit): GlucoseRangeStatus {
  const minimum = unit === 'g/L'
    ? GLUCOSE_REFERENCE_RANGE_G_PER_L.minimum
    : GLUCOSE_REFERENCE_RANGE_G_PER_L.minimum * GLUCOSE_CONVERSION_FACTOR;
  const maximum = unit === 'g/L'
    ? GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum
    : GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum * GLUCOSE_CONVERSION_FACTOR;
  const tolerance = Number.EPSILON * Math.max(1, maximum) * 4;

  if (value < minimum - tolerance) {
    return 'low';
  }
  if (value > maximum + tolerance) {
    return 'high';
  }
  return 'normal';
}

@Injectable({ providedIn: 'root' })
export class GlucoseConverterService {
  convert(value: number, sourceUnit: GlucoseUnit): CalculationResult {
    if (!Number.isFinite(value) || value <= 0 || value > Number.MAX_SAFE_INTEGER) {
      const targetUnit = sourceUnit === 'g/L' ? 'mmol/L' : 'g/L';
      return invalidResult(targetUnit, 'La glycémie doit être strictement supérieure à zéro.');
    }

    const targetUnit: GlucoseUnit = sourceUnit === 'g/L' ? 'mmol/L' : 'g/L';
    const rawValue = sourceUnit === 'g/L'
      ? value * GLUCOSE_CONVERSION_FACTOR
      : value / GLUCOSE_CONVERSION_FACTOR;

    if (!Number.isFinite(rawValue) || rawValue > Number.MAX_SAFE_INTEGER) {
      return invalidResult(targetUnit, 'Le résultat dépasse la plage de calcul fiable.');
    }

    return {
      rawValue,
      displayValue: formatNumber(rawValue, 2),
      unit: targetUnit,
      valid: true,
      error: null,
    };
  }
}
