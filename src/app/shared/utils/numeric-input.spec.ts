import { describe, expect, it } from 'vitest';
import { parseOptionalNonNegativeNumber, parsePositiveNumber } from './numeric-input';

describe('numeric input parsing', () => {
  it('accepts comma decimals and optional blank duration fields', () => {
    expect(parsePositiveNumber('1,25').value).toBe(1.25);
    expect(parseOptionalNonNegativeNumber('').value).toBeNull();
    expect(parseOptionalNonNegativeNumber('0').value).toBe(0);
  });

  it('rejects negatives, malformed strings, and unsafe magnitudes', () => {
    expect(parsePositiveNumber('-1').value).toBeNull();
    expect(parsePositiveNumber('1,2.3').value).toBeNull();
    expect(parsePositiveNumber('999999999999999999').error).toContain('trop élevée');
  });
});
