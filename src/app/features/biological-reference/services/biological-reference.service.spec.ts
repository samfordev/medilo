import { describe, expect, it } from 'vitest';
import { BIOLOGICAL_CATEGORIES, BIOLOGICAL_PARAMETERS } from '../data/biological-reference.data';
import { BiologicalReferenceService } from './biological-reference.service';

const expected: Record<string, readonly string[]> = {
  hematology: ['monocytes', 'eosinophils', 'basophils', 'reticulocytes', 'rdw', 'mch'],
  renal: ['egfr-ckd-epi', 'creatinine-clearance', 'albuminuria', 'urine-albumin-creatinine-ratio', 'ionized-calcium', 'plasma-osmolality'],
  metabolic: ['tca', 'fibrinogen', 'd-dimer', 'anti-xa-activity', 'hdl-cholesterol', 'ldl-cholesterol', 'non-hdl-cholesterol', 'procalcitonin', 'erythrocyte-sedimentation-rate'],
  liver: ['direct-bilirubin', 'indirect-bilirubin', 'ammonia'],
  nutrition: ['vitamin-b12', 'folate', 'vitamin-d-25-oh'],
  urinalysis: ['urine-protein', 'urine-glucose', 'urine-ketones', 'urine-blood', 'urine-leukocytes', 'urine-nitrites', 'urine-specific-gravity', 'urine-ph'],
  endocrine: ['cortisol', 'acth', 'pth', 'calcitonin', 'fsh', 'lh', 'estradiol', 'progesterone', 'testosterone', 'prolactin'],
  microbiology: ['blood-cultures', 'urine-culture', 'cytobacteriological-examination', 'antibiogram'],
  immunology: ['igg', 'iga', 'igm', 'ige', 'complement-c3', 'complement-c4', 'rheumatoid-factor', 'anti-ccp-antibodies', 'antinuclear-antibodies'],
  'pancreatic-digestive': ['lipase', 'amylase', 'fecal-elastase', 'fecal-calprotectin'],
};

describe('BiologicalReferenceService', () => {
  const service = new BiologicalReferenceService();

  it('contains the existing categories and all requested new categories and parameters', () => {
    expect(BIOLOGICAL_CATEGORIES).toHaveLength(14);
    expect(BIOLOGICAL_CATEGORIES.map((category) => category.icon.icon.name)).toEqual([
      'droplet', 'activity', 'wind', 'flask-conical', 'heart-pulse', 'heart', 'square-activity', 'beaker',
      'beaker', 'flask-conical', 'square-activity', 'microscope', 'shield-check', 'stethoscope',
    ]);
    expect(BIOLOGICAL_PARAMETERS).toHaveLength(115);
    expect(new Set(BIOLOGICAL_PARAMETERS.map((parameter) => parameter.id)).size).toBe(115);
    expect(BIOLOGICAL_PARAMETERS.every((parameter) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parameter.id))).toBe(true);
    expect(new Set(BIOLOGICAL_CATEGORIES.map((category) => category.id)).size).toBe(14);
    const newIds = new Set(Object.values(expected).flat());
    const newParameters = BIOLOGICAL_PARAMETERS.filter((parameter) => newIds.has(parameter.id));
    const normalizeName = (name: string) =>
      name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    expect(new Set(newParameters.map((parameter) => normalizeName(parameter.name))).size)
      .toBe(newParameters.length);
    for (const parameter of newParameters) {
      expect(BIOLOGICAL_PARAMETERS.filter((item) =>
        normalizeName(item.name) === normalizeName(parameter.name))).toHaveLength(1);
    }
    expect(BIOLOGICAL_PARAMETERS.every((parameter) =>
      BIOLOGICAL_CATEGORIES.some((category) => category.id === parameter.categoryId))).toBe(true);
    expect(BIOLOGICAL_CATEGORIES.map((category) => service.parametersInCategory(category.id).length))
      .toEqual([15, 15, 7, 10, 16, 4, 5, 5, 3, 8, 10, 4, 9, 4]);
    expect(BIOLOGICAL_CATEGORIES.every((category) =>
      typeof category.name === 'string' && category.name.length > 0 &&
      typeof category.description === 'string' && category.description.length > 0 &&
      category.icon.icon.name.length > 0 && category.iconColor.length > 0 && category.iconBackground.length > 0))
      .toBe(true);
  });

  it('places each requested parameter in its intended category without inventing ranges', () => {
    for (const [categoryId, ids] of Object.entries(expected)) {
      expect(service.parametersInCategory(categoryId).map((item) => item.id)).toEqual(
        expect.arrayContaining([...ids]),
      );
    }

    for (const parameter of BIOLOGICAL_PARAMETERS.filter((item) =>
      Object.values(expected).some((ids) => ids.includes(item.id)))) {
      expect(parameter.validationStatus).toBe('to-verify');
      expect(parameter.lastReviewedAt).toBeNull();
      expect(parameter.sources).toEqual([]);
      expect(parameter.referenceRanges).toEqual([]);
      if (parameter.unit) expect(parameter.referenceNotice).toContain('variables selon le laboratoire');
    }
    for (const id of ['urine-protein', 'urine-glucose', 'urine-ketones', 'urine-blood',
      'urine-leukocytes', 'urine-nitrites', 'blood-cultures', 'urine-culture',
      'cytobacteriological-examination', 'antibiogram']) {
      expect(service.parameter(id)?.qualitativeResults?.length).toBeGreaterThan(0);
      expect(service.parameter(id)?.referenceRanges).toEqual([]);
    }
  });

  it('searches names, abbreviations, synonyms, units and normalized accents', () => {
    expect(service.search('K').map((parameter) => parameter.id)).toContain('potassium');
    expect(service.search('Kaliémie').map((parameter) => parameter.id)).toContain('potassium');
    expect(service.search('Cl-').map((parameter) => parameter.id)).toContain('chloride');
    expect(service.search('HCO3-').map((parameter) => parameter.id)).toContain('bicarbonate');
    expect(service.search('  hB  ').map((parameter) => parameter.id)).toContain('hemoglobin');
    expect(service.search('Créat').map((parameter) => parameter.id)).toContain('creatinine');
    expect(service.search('mmol/L').length).toBeGreaterThan(0);
    expect(service.search('ACTH').map((parameter) => parameter.id)).toContain('acth');
    expect(service.search('calprotectine').map((parameter) => parameter.id)).toContain('fecal-calprotectin');
    expect(service.search('ECBU').map((parameter) => parameter.id)).toContain('urine-culture');
    expect(service.parametersInCategory('urinalysis').map((parameter) => parameter.id)).toContain('urine-ph');
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
