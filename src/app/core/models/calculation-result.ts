export interface CalculationResult {
  readonly rawValue: number | null;
  readonly displayValue: string | null;
  readonly unit: string;
  readonly valid: boolean;
  readonly error: string | null;
}

export function invalidResult(unit: string, error: string): CalculationResult {
  return {
    rawValue: null,
    displayValue: null,
    unit,
    valid: false,
    error,
  };
}

export function formatNumber(value: number, fractionDigits: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
