import { describe, expect, it } from 'vitest';
import { classifyGlucoseValue, GlucoseConverterService } from './glucose-converter.service';

describe('GlucoseConverterService', () => {
  const converter = new GlucoseConverterService();

  it('converts from g/L to mmol/L with two decimal places', () => {
    const result = converter.convert(1.2, 'g/L');

    expect(result.rawValue).toBeCloseTo(6.66);
    expect(result.displayValue).toBe('6,66');
    expect(result.unit).toBe('mmol/L');
  });

  it('converts from mmol/L to g/L', () => {
    const result = converter.convert(6.66, 'mmol/L');

    expect(result.rawValue).toBeCloseTo(1.2);
    expect(result.displayValue).toBe('1,20');
    expect(result.unit).toBe('g/L');
  });

  it('rejects non-positive values and unsafe results', () => {
    expect(converter.convert(0, 'g/L').valid).toBe(false);
    expect(converter.convert(Number.MAX_SAFE_INTEGER, 'g/L').valid).toBe(false);
  });

  it('classifies reference bounds inclusively in both supported units', () => {
    expect(classifyGlucoseValue(0.69, 'g/L')).toBe('low');
    expect(classifyGlucoseValue(0.7, 'g/L')).toBe('normal');
    expect(classifyGlucoseValue(1.1, 'g/L')).toBe('normal');
    expect(classifyGlucoseValue(1.11, 'g/L')).toBe('high');

    expect(classifyGlucoseValue(3.88, 'mmol/L')).toBe('low');
    expect(classifyGlucoseValue(3.885, 'mmol/L')).toBe('normal');
    expect(classifyGlucoseValue(6.105, 'mmol/L')).toBe('normal');
    expect(classifyGlucoseValue(6.11, 'mmol/L')).toBe('high');
  });
});
