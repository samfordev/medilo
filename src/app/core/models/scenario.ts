export type ScenarioUnit =
  | '1'
  | 'mg'
  | 'g'
  | 'µg'
  | 'ml'
  | 'L'
  | 'mg/ml'
  | 'g/L'
  | 'µg/ml'
  | 'ml/h'
  | 'L/h'
  | 'gouttes/ml'
  | 'gouttes/min'
  | 'min'
  | 'h';

export type ScenarioOperation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface ScenarioInputStep {
  readonly id: string;
  readonly name: string;
  readonly kind: 'input';
  readonly value: string;
  readonly unit: ScenarioUnit;
  readonly positive?: boolean;
}

export interface ScenarioOperationStep {
  readonly id: string;
  readonly name: string;
  readonly kind: 'operation';
  readonly operation: ScenarioOperation;
  readonly left: string;
  readonly right: string;
  readonly unit: ScenarioUnit;
}

export interface ScenarioTransferStep {
  readonly id: string;
  readonly name: string;
  readonly kind: 'conversion' | 'display';
  readonly source: string;
  readonly unit: ScenarioUnit;
}

export type ScenarioStep = ScenarioInputStep | ScenarioOperationStep | ScenarioTransferStep;

export interface Scenario {
  readonly name: string;
  readonly steps: readonly ScenarioStep[];
}

export interface ScenarioStepResult {
  readonly stepId: string;
  readonly value: number | null;
  readonly unit: ScenarioUnit;
  readonly error: string | null;
}
