import { describe, expect, it } from 'vitest';
import { FlowRateCalculatorService } from './flow-rate-calculator.service';

describe('FlowRateCalculatorService', () => {
  const calculator = new FlowRateCalculatorService();

  it('calculates hourly flow for hour and minute durations', () => {
    expect(calculator.calculate(500, 240).displayValue).toBe('125,00');
    expect(calculator.calculate(250, 90).displayValue).toBe('166,67');
    expect(calculator.calculate(100, 30).displayValue).toBe('200,00');
  });

  it('rejects zero, negative, and unsafe inputs', () => {
    expect(calculator.calculate(100, 0).valid).toBe(false);
    expect(calculator.calculate(-1, 60).valid).toBe(false);
    expect(calculator.calculate(Number.MAX_SAFE_INTEGER, 1).valid).toBe(false);
  });
});
