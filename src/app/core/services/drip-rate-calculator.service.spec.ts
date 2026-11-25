import { describe, expect, it } from 'vitest';
import { DripRateCalculatorService } from './drip-rate-calculator.service';

describe('DripRateCalculatorService', () => {
  const calculator = new DripRateCalculatorService();

  it('calculates the theoretical rate without rounding before display', () => {
    const result = calculator.calculate(500, 240, 'standard');

    expect(result.rawValue).toBeCloseTo(41.6666666667);
    expect(result.displayValue).toBe('42');
    expect(result.unit).toBe('gouttes/min');
  });

  it('uses the blood factor and rounds to the nearest whole drop', () => {
    const result = calculator.calculate(500, 240, 'blood');

    expect(result.rawValue).toBe(31.25);
    expect(result.displayValue).toBe('31');
  });

  it('rejects zero durations and results outside the safe numeric range', () => {
    expect(calculator.calculate(500, 0, 'standard').valid).toBe(false);
    expect(calculator.calculate(Number.MAX_SAFE_INTEGER, 1, 'standard').valid).toBe(false);
  });
});
