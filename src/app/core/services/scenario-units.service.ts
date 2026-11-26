import { Injectable } from '@angular/core';
import { ScenarioOperation, ScenarioUnit } from '../models/scenario';

type Dimension = readonly [mass: number, volume: number, time: number, drops: number];

interface UnitDefinition {
  readonly dimension: Dimension;
  readonly scale: number;
}

// Base units: mg, ml, h and drops.
const UNITS: Readonly<Record<ScenarioUnit, UnitDefinition>> = {
  '1': { dimension: [0, 0, 0, 0], scale: 1 },
  mg: { dimension: [1, 0, 0, 0], scale: 1 },
  g: { dimension: [1, 0, 0, 0], scale: 1000 },
  µg: { dimension: [1, 0, 0, 0], scale: 0.001 },
  ml: { dimension: [0, 1, 0, 0], scale: 1 },
  L: { dimension: [0, 1, 0, 0], scale: 1000 },
  'mg/ml': { dimension: [1, -1, 0, 0], scale: 1 },
  'g/L': { dimension: [1, -1, 0, 0], scale: 1 },
  'µg/ml': { dimension: [1, -1, 0, 0], scale: 0.001 },
  'ml/h': { dimension: [0, 1, -1, 0], scale: 1 },
  'L/h': { dimension: [0, 1, -1, 0], scale: 1000 },
  'gouttes/ml': { dimension: [0, -1, 0, 1], scale: 1 },
  'gouttes/min': { dimension: [0, 0, -1, 1], scale: 60 },
  min: { dimension: [0, 0, 1, 0], scale: 1 / 60 },
  h: { dimension: [0, 0, 1, 0], scale: 1 },
};

function sameDimension(a: Dimension, b: Dimension): boolean {
  return a.every((exponent, index) => exponent === b[index]);
}

@Injectable({ providedIn: 'root' })
export class ScenarioUnitsService {
  compatible(from: ScenarioUnit, to: ScenarioUnit): boolean {
    return !!UNITS[from] && !!UNITS[to] && sameDimension(UNITS[from].dimension, UNITS[to].dimension);
  }

  convert(value: number, from: ScenarioUnit, to: ScenarioUnit): number | null {
    if (!this.compatible(from, to) || !Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) {
      return null;
    }
    const result = value * (UNITS[from].scale / UNITS[to].scale);
    if (!Number.isFinite(result) || result > Number.MAX_SAFE_INTEGER || (value !== 0 && result === 0)) {
      return null;
    }
    return result;
  }

  supportsOperation(
    operation: ScenarioOperation,
    left: ScenarioUnit,
    right: ScenarioUnit,
    output: ScenarioUnit,
  ): boolean {
    const a = UNITS[left];
    const b = UNITS[right];
    const result = UNITS[output];
    if (!a || !b || !result) {
      return false;
    }
    if (operation === 'add' || operation === 'subtract') {
      return sameDimension(a.dimension, b.dimension) && sameDimension(a.dimension, result.dimension);
    }
    if (operation !== 'multiply' && operation !== 'divide') {
      return false;
    }
    return result.dimension.every((exponent, index) =>
      exponent === a.dimension[index] + (operation === 'multiply' ? 1 : -1) * b.dimension[index],
    );
  }

  calculate(
    operation: ScenarioOperation,
    leftValue: number,
    leftUnit: ScenarioUnit,
    rightValue: number,
    rightUnit: ScenarioUnit,
    outputUnit: ScenarioUnit,
  ): number | null {
    if (!this.supportsOperation(operation, leftUnit, rightUnit, outputUnit) ||
        !Number.isFinite(leftValue) || !Number.isFinite(rightValue) ||
        leftValue < 0 || rightValue < 0 ||
        leftValue > Number.MAX_SAFE_INTEGER || rightValue > Number.MAX_SAFE_INTEGER ||
        (operation === 'divide' && rightValue === 0)) {
      return null;
    }
    const a = leftValue * UNITS[leftUnit].scale;
    const b = rightValue * UNITS[rightUnit].scale;
    let raw: number;
    switch (operation) {
      case 'add': raw = a + b; break;
      case 'subtract': raw = a - b; break;
      case 'multiply': raw = a * b; break;
      case 'divide': raw = a / b; break;
    }
    const result = raw / UNITS[outputUnit].scale;
    if (!Number.isFinite(result) || result < 0 || result > Number.MAX_SAFE_INTEGER ||
        (leftValue !== 0 && a === 0) || (rightValue !== 0 && b === 0) ||
        (operation === 'multiply' && a !== 0 && b !== 0 && result === 0) ||
        (operation === 'divide' && a !== 0 && result === 0)) {
      return null;
    }
    return result;
  }
}
