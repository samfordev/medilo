import { describe, expect, it } from 'vitest';
import { BIOLOGICAL_CATEGORIES, BIOLOGICAL_PARAMETERS } from '../data/biological-reference.data';
import { BiologicalReferenceService } from './biological-reference.service';

describe('BiologicalReferenceService', () => {
  const service = new BiologicalReferenceService();

  it('contains all eight categories and the 53 requested parameters', () => {
    expect(BIOLOGICAL_CATEGORIES).toHaveLength(8);
    expect(BIOLOGICAL_CATEGORIES.map((category) => category.icon.icon.name)).toEqual([
      'droplet', 'activity', 'wind', 'flask-conical', 'heart-pulse', 'heart', 'square-activity', 'beaker',
    ]);
    expect(BIOLOGICAL_PARAMETERS).toHaveLength(53);
    expect(new Set(BIOLOGICAL_PARAMETERS.map((parameter) => parameter.id)).size).toBe(53);
    expect(BIOLOGICAL_PARAMETERS.every((parameter) =>
      BIOLOGICAL_CATEGORIES.some((category) => category.id === parameter.categoryId))).toBe(true);
    expect(BIOLOGICAL_CATEGORIES.map((category) => service.parametersInCategory(category.id).length))
      .toEqual([9, 9, 7, 7, 7, 4, 5, 5]);
  });

  it('searches names, abbreviations, synonyms, units and normalized accents', () => {
    expect(service.search('K').map((parameter) => parameter.id)).toContain('potassium');
    expect(service.search('Kaliémie').map((parameter) => parameter.id)).toContain('potassium');
    expect(service.search('Cl-').map((parameter) => parameter.id)).toContain('chloride');
    expect(service.search('HCO3-').map((parameter) => parameter.id)).toContain('bicarbonate');
    expect(service.search('  hB  ').map((parameter) => parameter.id)).toContain('hemoglobin');
    expect(service.search('Créat').map((parameter) => parameter.id)).toContain('creatinine');
    expect(service.search('mmol/L').length).toBeGreaterThan(0);
    expect(service.search('valeur totalement inconnue')).toEqual([]);
  });

  it('keeps reference ranges separate from unpopulated diagnostic and alert thresholds', () => {
    const creatinine = service.parameter('creatinine');
    expect(creatinine?.referenceRanges.map((item) => item.sex)).toEqual(['male', 'female']);
    expect(creatinine?.diagnosticThresholds).toEqual([]);
    expect(creatinine?.alertThresholds).toEqual([]);
    expect(service.parameter('high-sensitivity-troponin')?.referenceRanges[0].min).toBeUndefined();
  });

  it('keeps reference units consistent and intervals ordered while marking all supplied data unverified', () => {
    for (const parameter of BIOLOGICAL_PARAMETERS) {
      expect(parameter.validationStatus).toBe('to-verify');
      expect(parameter.lastReviewedAt).toBeNull();
      for (const item of parameter.referenceRanges) {
        expect(item.unit).toBe(parameter.unit);
        if (item.min !== undefined && item.max !== undefined) expect(item.min).toBeLessThanOrEqual(item.max);
      }
    }
  });
});
