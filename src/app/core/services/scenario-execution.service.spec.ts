import { describe, expect, it } from 'vitest';
import { Scenario, ScenarioStep } from '../models/scenario';
import { ScenarioExecutionService } from './scenario-execution.service';
import { ScenarioUnitsService } from './scenario-units.service';
import { createScenarioTemplate, SCENARIO_TEMPLATES } from '../models/scenario-templates';
import { FlowRateCalculatorService } from './flow-rate-calculator.service';
import { DripRateCalculatorService } from './drip-rate-calculator.service';

const units = new ScenarioUnitsService();
const engine = new ScenarioExecutionService(units);

function execute(steps: readonly ScenarioStep[]) {
  return engine.execute({ name: 'Test', steps });
}

describe('ScenarioUnitsService', () => {
  it('converts compatible units without rounding', () => {
    expect(units.convert(1, 'g', 'mg')).toBe(1000);
    expect(units.convert(1, 'mg', 'µg')).toBe(1000);
    expect(units.convert(1, 'L', 'ml')).toBe(1000);
    expect(units.convert(1, 'g/L', 'mg/ml')).toBe(1);
    expect(units.convert(1, 'mg/ml', 'µg/ml')).toBe(1000);
    expect(units.convert(1, 'L/h', 'ml/h')).toBe(1000);
    expect(units.convert(2, 'h', 'min')).toBe(120);
    expect(units.convert(1, 'mg', 'ml')).toBeNull();
    expect(units.convert(Infinity, 'mg', 'g')).toBeNull();
  });

  describe('Modèles de calcul', () => {
    const cases = [
      { id: 'infusion', values: ['500', '1000', '10', '100', '2', '20'], expected: 1000 / 60 },
      { id: 'reconstitution', values: ['1000', '10', '500'], expected: 5 },
      { id: 'concentration', values: ['500', '100'], expected: 5 },
      { id: 'drops', values: ['50', '20'], expected: 1000 / 60 },
      { id: 'duration', values: ['100', '50'], expected: 2 },
    ] as const;

    it('requires explicit positive parameters for every medical template', () => {
      for (const template of SCENARIO_TEMPLATES) {
        const scenario = createScenarioTemplate(template.id);
        expect(scenario.steps.filter((step) => step.kind === 'input')
          .every((step) => step.value === '' && step.positive)).toBe(true);
        expect(engine.execute(scenario).at(-1)?.value).toBeNull();
      }
    });

    for (const example of cases) {
      it(`calculates the reference case ${example.id}`, () => {
        const scenario = createScenarioTemplate(example.id);
        let index = 0;
        const filled = {
          ...scenario,
          steps: scenario.steps.map((step) =>
            step.kind === 'input' ? { ...step, value: example.values[index++] } : step),
        };
        const results = engine.execute(filled);
        expect(results.every((result) => result.error === null)).toBe(true);
        expect(results.at(-1)?.value).toBeCloseTo(example.expected);
        const invalid = { ...filled, steps: filled.steps.map((step) =>
          step.kind === 'input' ? { ...step, value: '0' } : step) };
        expect(engine.execute(invalid).at(-1)?.value).toBeNull();
      });
    }
  });

  it('supports all four operations with dimension and scale checks', () => {
    expect(units.calculate('add', 1, 'g', 500, 'mg', 'mg')).toBe(1500);
    expect(units.calculate('subtract', 1, 'g', 500, 'mg', 'mg')).toBe(500);
    expect(units.calculate('multiply', 50, 'ml/h', 20, 'gouttes/ml', 'gouttes/min'))
      .toBeCloseTo(1000 / 60);
    expect(units.calculate('divide', 500, 'mg', 5, 'mg/ml', 'ml')).toBe(100);
    expect(units.calculate('add', 1, 'mg', 1, 'ml', 'mg')).toBeNull();
    expect(units.calculate('multiply', 1, 'mg', 1, 'ml', 'mg')).toBeNull();
    expect(units.calculate('divide', 1, 'mg', 0, 'ml', 'mg/ml')).toBeNull();
    expect(units.calculate('subtract', 1, 'mg', 2, 'mg', 'mg')).toBeNull();
    expect(units.calculate('multiply', -1, 'mg', -2, '1', 'mg')).toBeNull();
    expect(units.calculate('multiply', Number.MAX_SAFE_INTEGER, 'mg', 2, '1', 'mg')).toBeNull();
  });

  it('agrees with the existing flow and drip calculators', () => {
    const flow = new FlowRateCalculatorService().calculate(100, 120);
    const drip = new DripRateCalculatorService().calculate(100, 120, 'standard');
    const calculatedFlow = units.calculate('divide', 100, 'ml', 2, 'h', 'ml/h');
    expect(calculatedFlow).toBe(flow.rawValue);
    expect(units.calculate('multiply', calculatedFlow!, 'ml/h', 20, 'gouttes/ml', 'gouttes/min'))
      .toBeCloseTo(drip.rawValue!);
  });
});

describe('ScenarioExecutionService', () => {
  const steps: readonly ScenarioStep[] = [
    { id: 'prescribed', name: 'Prescrite', kind: 'input', value: '500', unit: 'mg' },
    { id: 'available', name: 'Disponible', kind: 'input', value: '1000', unit: 'mg' },
    { id: 'reconstitution', name: 'Reconstitution', kind: 'input', value: '10', unit: 'ml' },
    { id: 'final', name: 'Volume final', kind: 'input', value: '100', unit: 'ml' },
    { id: 'duration', name: 'Durée', kind: 'input', value: '2', unit: 'h' },
    { id: 'factor', name: 'Facteur', kind: 'input', value: '20', unit: 'gouttes/ml' },
    { id: 'concentration', name: 'Concentration', kind: 'operation', operation: 'divide', left: 'available', right: 'reconstitution', unit: 'mg/ml' },
    { id: 'draw', name: 'Volume à prélever', kind: 'operation', operation: 'divide', left: 'prescribed', right: 'concentration', unit: 'ml' },
    { id: 'final-concentration', name: 'Concentration finale', kind: 'operation', operation: 'divide', left: 'prescribed', right: 'final', unit: 'mg/ml' },
    { id: 'flow', name: 'Débit', kind: 'operation', operation: 'divide', left: 'final', right: 'duration', unit: 'ml/h' },
    { id: 'drops', name: 'Gouttes', kind: 'operation', operation: 'multiply', left: 'flow', right: 'factor', unit: 'gouttes/min' },
  ];

  it('calculates the reference infusion and recalculates downstream results', () => {
    const result = execute(steps);
    expect(result.map((entry) => entry.error)).toEqual(steps.map(() => null));
    expect(result[6].value).toBe(100);
    expect(result[7].value).toBe(5);
    expect(result[8].value).toBe(5);
    expect(result[9].value).toBe(50);
    expect(result[10].value).toBeCloseTo(1000 / 60);
    const changed: Scenario = {
      name: 'Test',
      steps: steps.map((step) => step.id === 'duration' && step.kind === 'input'
        ? { ...step, value: '4' } : step),
    };
    expect(engine.execute(changed)[9].value).toBe(25);
    expect(engine.execute(changed)[10].value).toBeCloseTo(500 / 60);
  });

  it('blocks missing, invalid, zero-divisor and dependent results', () => {
    for (const value of ['', '-1', 'NaN', 'Infinity', '1e100', '0', `0.${'0'.repeat(400)}1`]) {
      const changed = steps.map((step) => step.id === 'duration' && step.kind === 'input'
        ? { ...step, value } : step);
      const result = execute(changed);
      expect(result[9].value).toBeNull();
      expect(result[9].error).toBeTruthy();
      expect(result[10].value).toBeNull();
    }
  });

  it('rejects forward references, invalid dimensions, and duplicate identifiers', () => {
    const bad: readonly ScenarioStep[] = [
      { id: 'a', name: 'A', kind: 'conversion', source: 'b', unit: 'g' },
      { id: 'valid', name: 'Valide', kind: 'input', value: '1', unit: 'mg' },
      { id: 'c', name: 'C', kind: 'conversion', source: 'valid', unit: 'ml' },
      { id: 'b', name: 'B', kind: 'input', value: '1', unit: 'mg' },
      { id: 'b', name: 'Duplicate', kind: 'input', value: '2', unit: 'mg' },
      { id: 'd', name: 'D', kind: 'display', source: 'b', unit: 'mg' },
    ];
    const result = execute(bad);
    expect(result[1].value).toBe(1);
    expect(result.filter((_, index) => index !== 1)
      .every((entry) => entry.value === null && entry.error)).toBe(true);
  });
});
