export interface ParsedNumber {
  readonly value: number | null;
  readonly error: string | null;
}

const NUMBER_PATTERN = /^-?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/;

export function parsePositiveNumber(input: string): ParsedNumber {
  const parsed = parseNumber(input);
  if (parsed.value === null) {
    return parsed;
  }
  if (parsed.value <= 0) {
    return { value: null, error: 'Saisissez un nombre strictement supérieur à zéro.' };
  }
  return parsed;
}

export function parseOptionalNonNegativeNumber(input: string): ParsedNumber {
  if (input.trim() === '') {
    return { value: null, error: null };
  }
  const parsed = parseNumber(input);
  if (parsed.value === null) {
    return parsed;
  }
  if (parsed.value < 0) {
    return { value: null, error: 'Saisissez un nombre positif ou nul.' };
  }
  return parsed;
}

function parseNumber(input: string): ParsedNumber {
  const normalized = input.trim().replace(',', '.');
  if (!NUMBER_PATTERN.test(input.trim())) {
    return { value: null, error: 'Saisissez un nombre valide.' };
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return { value: null, error: 'La valeur saisie est trop élevée.' };
  }
  if (value > Number.MAX_SAFE_INTEGER) {
    return { value: null, error: 'La valeur saisie est trop élevée.' };
  }
  return { value, error: null };
}
