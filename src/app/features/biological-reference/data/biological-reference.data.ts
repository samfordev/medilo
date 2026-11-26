import { BiologicalCategory, BiologicalParameter, BiologicalSex, ReferenceRange } from '../models/biological-reference';
import {
  LucideActivity,
  LucideActivitySquare,
  LucideBeaker,
  LucideDroplet,
  LucideFlaskConical,
  LucideHeart,
  LucideHeartPulse,
  LucideWind,
} from '@lucide/angular';

export const BIOLOGICAL_CATEGORIES: readonly BiologicalCategory[] = [
  { id: 'hematology', name: 'Hématologie', description: 'Cellules sanguines et plaquettes.', icon: LucideDroplet, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 1 },
  { id: 'renal', name: 'Ionogramme et fonction rénale', description: 'Électrolytes et marqueurs rénaux.', icon: LucideActivity, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 2 },
  { id: 'blood-gas', name: 'Gaz du sang artériel', description: 'Équilibre acido-basique et échanges gazeux.', icon: LucideWind, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 3 },
  { id: 'liver', name: 'Bilan hépatique', description: 'Enzymes et paramètres hépatiques.', icon: LucideFlaskConical, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 4 },
  { id: 'metabolic', name: 'Glycémie, lipides, inflammation et coagulation', description: 'Paramètres métaboliques, inflammatoires et de coagulation.', icon: LucideHeartPulse, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 5 },
  { id: 'cardiac', name: 'Marqueurs cardiaques et musculaires', description: 'Marqueurs cardiaques et enzymes musculaires.', icon: LucideHeart, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 6 },
  { id: 'thyroid', name: 'Bilan thyroïdien', description: 'Hormones et anticorps thyroïdiens.', icon: LucideActivitySquare, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 7 },
  { id: 'iron', name: 'Bilan martial', description: 'Fer circulant et réserves martiales.', icon: LucideBeaker, iconColor: 'var(--teal-dark)', iconBackground: 'var(--mint)', order: 8 },
];

function range(
  label: string,
  unit: string,
  sex: BiologicalSex = 'all',
  min?: number,
  max?: number,
  minInclusive = true,
  maxInclusive = true,
  conditions?: string,
): ReferenceRange {
  return { label, unit, sex, min, max, minInclusive, maxInclusive, conditions };
}

function parameter(
  id: string,
  categoryId: string,
  name: string,
  abbreviation: string,
  unit: string,
  referenceRanges: readonly ReferenceRange[],
  synonyms: readonly string[] = [],
  clinicalNotes: readonly string[] = [],
  variations: readonly string[] = [],
): BiologicalParameter {
  return {
    id,
    categoryId,
    name,
    abbreviation,
    synonyms,
    description: 'Description clinique à compléter et à valider médicalement.',
    role: 'Rôle physiologique à documenter et à valider médicalement.',
    unit,
    referenceRanges,
    diagnosticThresholds: [],
    clinicalNotes,
    alertThresholds: [],
    interpretation: [],
    variations,
    precautions: [],
    sources: [],
    lastReviewedAt: null,
    validationStatus: 'to-verify',
  };
}

export const BIOLOGICAL_PARAMETERS: readonly BiologicalParameter[] = [
  parameter('red-blood-cells', 'hematology', 'Hématies (globules rouges)', 'GR', 'T/L', [
    range('4,2–5,8', 'T/L', 'male', 4.2, 5.8), range('4,0–5,3', 'T/L', 'female', 4, 5.3),
  ], ['érythrocytes', 'globules rouges'], [], ['Valeurs distinctes dans le tableau initial selon le sexe.']),
  parameter('hemoglobin', 'hematology', 'Hémoglobine', 'Hb', 'g/dL', [
    range('13–18', 'g/dL', 'male', 13, 18), range('12–16', 'g/dL', 'female', 12, 16),
  ], ['hémoglobine sanguine'], [], ['Valeurs distinctes dans le tableau initial selon le sexe.']),
  parameter('hematocrit', 'hematology', 'Hématocrite', 'Ht', '%', [
    range('40–52', '%', 'male', 40, 52), range('37–46', '%', 'female', 37, 46),
  ], ['hématocrite sanguin'], [], ['Valeurs distinctes dans le tableau initial selon le sexe.']),
  parameter('mcv', 'hematology', 'Volume globulaire moyen', 'VGM', 'fL', [range('80–100', 'fL', 'all', 80, 100)], ['volume corpusculaire moyen']),
  parameter('mchc', 'hematology', 'Concentration corpusculaire moyenne en hémoglobine', 'CCMH', 'g/dL', [range('32–36', 'g/dL', 'all', 32, 36)]),
  parameter('leukocytes', 'hematology', 'Leucocytes (globules blancs)', 'GB', 'G/L', [range('4–10', 'G/L', 'all', 4, 10)], ['globules blancs', 'leucocytes']),
  parameter('neutrophils', 'hematology', 'Polynucléaires neutrophiles', 'PNN', 'G/L', [range('1,5–7', 'G/L', 'all', 1.5, 7)], ['neutrophiles']),
  parameter('lymphocytes', 'hematology', 'Lymphocytes', 'LYM', 'G/L', [range('1–4', 'G/L', 'all', 1, 4)]),
  parameter('platelets', 'hematology', 'Plaquettes', 'PLT', 'G/L', [range('150–450', 'G/L', 'all', 150, 450)], ['thrombocytes']),

  parameter('sodium', 'renal', 'Sodium', 'Na+', 'mmol/L', [range('135–145', 'mmol/L', 'all', 135, 145)], ['natriémie']),
  parameter('potassium', 'renal', 'Potassium', 'K', 'mmol/L', [range('3,5–5', 'mmol/L', 'all', 3.5, 5)], ['K+', 'kaliémie']),
  parameter('chloride', 'renal', 'Chlore', 'Cl−', 'mmol/L', [range('95–105', 'mmol/L', 'all', 95, 105)], ['Cl-', 'chlorémie']),
  parameter('bicarbonate', 'renal', 'Bicarbonates', 'HCO3−', 'mmol/L', [range('22–30', 'mmol/L', 'all', 22, 30)], ['HCO3-', 'bicarbonate']),
  parameter('total-calcium', 'renal', 'Calcium total', 'Ca', 'mmol/L', [range('2,20–2,62', 'mmol/L', 'all', 2.2, 2.62)], ['calcémie']),
  parameter('magnesium', 'renal', 'Magnésium', 'Mg', 'mmol/L', [range('0,70–0,90', 'mmol/L', 'all', 0.7, 0.9)], ['magnésémie']),
  parameter('phosphate', 'renal', 'Phosphore', 'P', 'mmol/L', [range('0,80–1,35', 'mmol/L', 'all', 0.8, 1.35)], ['phosphatémie']),
  parameter('urea', 'renal', 'Urée', 'urée', 'mmol/L', [range('2,5–7,5', 'mmol/L', 'all', 2.5, 7.5)], ['azotémie']),
  parameter('creatinine', 'renal', 'Créatinine', 'Créat', 'µmol/L', [
    range('60–115', 'µmol/L', 'male', 60, 115), range('45–105', 'µmol/L', 'female', 45, 105),
  ], ['créatininémie', 'creat'], [], ['Valeurs distinctes dans le tableau initial selon le sexe.']),

  parameter('ph', 'blood-gas', 'Potentiel hydrogène', 'pH', '', [range('7,35–7,45', '', 'all', 7.35, 7.45)], ['acidité sanguine']),
  parameter('pao2', 'blood-gas', 'Pression partielle artérielle en oxygène', 'PaO2', 'mmHg', [range('80–100', 'mmHg', 'all', 80, 100)], ['pression partielle en oxygène']),
  parameter('paco2', 'blood-gas', 'Pression partielle artérielle en dioxyde de carbone', 'PaCO2', 'mmHg', [range('35–45', 'mmHg', 'all', 35, 45)], ['pression partielle en CO2']),
  parameter('blood-gas-bicarbonate', 'blood-gas', 'Bicarbonates', 'HCO3−', 'mmol/L', [range('22–26', 'mmol/L', 'all', 22, 26)], ['HCO3-', 'bicarbonate']),
  parameter('oxygen-saturation', 'blood-gas', 'Saturation artérielle en oxygène', 'SaO2', '%', [range('94–100', '%', 'all', 94, 100)], ['saturation en oxygène']),
  parameter('base-excess', 'blood-gas', 'Excès de base', 'BE', 'mmol/L', [range('−2 à +2', 'mmol/L', 'all', -2, 2)], ['base excess']),
  parameter('lactate', 'blood-gas', 'Lactates', 'Lactates', 'mmol/L', [range('0,5–2', 'mmol/L', 'all', 0.5, 2)], ['lactatémie']),

  parameter('asat', 'liver', 'ASAT (TGO)', 'ASAT', 'UI/L', [range('< 40', 'UI/L', 'all', undefined, 40, true, false)], ['TGO', 'aspartate aminotransférase'], ['Valeur maximale indicative telle que fournie; méthode analytique à confirmer.']),
  parameter('alat', 'liver', 'ALAT (TGP)', 'ALAT', 'UI/L', [range('< 40–56 selon méthode', 'UI/L', 'all', undefined, undefined)], ['TGP', 'alanine aminotransférase'], ['La valeur dépend de la méthode analytique; vérifier l’intervalle du laboratoire.']),
  parameter('ggt', 'liver', 'Gamma-GT', 'GGT', 'UI/L', [range('< 58', 'UI/L', 'all', undefined, 58, true, false)], ['gamma-glutamyl transférase'], ['Valeur maximale indicative telle que fournie; méthode analytique à confirmer.']),
  parameter('alkaline-phosphatase', 'liver', 'Phosphatases alcalines', 'PAL', 'UI/L', [range('30–100', 'UI/L', 'all', 30, 100)]),
  parameter('bilirubin', 'liver', 'Bilirubine totale', 'Bilirubine totale', 'µmol/L', [range('< 17', 'µmol/L', 'all', undefined, 17, true, false)], ['bilirubinémie']),
  parameter('albumin', 'liver', 'Albumine', 'Albumine', 'g/L', [range('35–50', 'g/L', 'all', 35, 50)]),
  parameter('total-protein', 'liver', 'Protéines totales', 'Protides', 'g/L', [range('65–80', 'g/L', 'all', 65, 80)], ['protidémie']),

  parameter('fasting-glucose', 'metabolic', 'Glycémie à jeun', 'Glycémie', 'g/L', [range('0,70–1,10', 'g/L', 'all', 0.7, 1.1)], ['glucose', 'glycémie', 'sucre sanguin'], ['Valeur fournie pour un prélèvement à jeun.']),
  parameter('hba1c', 'metabolic', 'Hémoglobine glyquée', 'HbA1c', '%', [range('4–6', '%', 'all', 4, 6)], ['hémoglobine A1c']),
  parameter('total-cholesterol', 'metabolic', 'Cholestérol total', 'Cholestérol', 'g/L', [range('< 2', 'g/L', 'all', undefined, 2, true, false)], ['cholestérolémie']),
  parameter('triglycerides', 'metabolic', 'Triglycérides', 'TG', 'g/L', [range('< 1,5', 'g/L', 'all', undefined, 1.5, true, false)], ['triglycéridémie']),
  parameter('crp', 'metabolic', 'Protéine C-réactive', 'CRP', 'mg/L', [range('< 5–10 selon laboratoire', 'mg/L', 'all', undefined, undefined)], ['protéine C réactive'], ['La valeur varie selon le laboratoire; se référer à l’intervalle indiqué sur le compte rendu.']),
  parameter('prothrombin-time', 'metabolic', 'Taux de prothrombine', 'TP', '%', [range('> 70', '%', 'all', 70, undefined, false)], ['temps de prothrombine']),
  parameter('inr', 'metabolic', 'International Normalized Ratio', 'INR', '', [range('Environ 1 hors anticoagulant AVK', '', 'all')], ['ratio normalisé international'], ['La valeur fournie concerne les personnes hors anticoagulant AVK.']),

  parameter('high-sensitivity-troponin', 'cardiac', 'Troponine ultrasensible', 'Troponine hs', 'Selon méthode', [
    range('Seuil du 99e percentile : dépend de la méthode, du sexe et de la trousse', 'Selon méthode'),
  ], ['troponine', 'hs-troponine'], ['Aucune valeur numérique universelle fournie; consulter le seuil du laboratoire et la méthode utilisée.'], ['Dépend de la méthode, du sexe et de la trousse.']),
  parameter('nt-probnp', 'cardiac', 'NT-proBNP', 'NT-proBNP', 'pg/mL', [range('< 125 en ambulatoire', 'pg/mL', 'all', undefined, 125, true, false)], ['peptide natriurétique']),
  parameter('creatine-kinase', 'cardiac', 'Créatine kinase', 'CK', 'UI/L', [range('30–200', 'UI/L', 'all', 30, 200)], ['CPK', 'créatine phosphokinase']),
  parameter('ldh', 'cardiac', 'Lactate déshydrogénase', 'LDH', 'UI/L', [range('100–350 selon méthode', 'UI/L', 'all', 100, 350)], ['lactate déshydrogénase'], ['La méthode analytique peut faire varier l’intervalle.']),

  parameter('tsh', 'thyroid', 'Thyréostimuline', 'TSH', 'mUI/L', [range('0,4–4', 'mUI/L', 'all', 0.4, 4)], ['thyroid stimulating hormone']),
  parameter('free-t4', 'thyroid', 'Thyroxine libre', 'T4 libre', 'pmol/L', [range('9–23', 'pmol/L', 'all', 9, 23)], ['FT4']),
  parameter('free-t3', 'thyroid', 'Triiodothyronine libre', 'T3 libre', 'pmol/L', [range('3,5–6,5', 'pmol/L', 'all', 3.5, 6.5)], ['FT3']),
  parameter('anti-tpo', 'thyroid', 'Anticorps anti-thyroperoxydase', 'Anti-TPO', 'UI/mL', [range('< 34 selon méthode', 'UI/mL', 'all', undefined, 34, true, false)], ['anticorps anti TPO'], ['Seuil dépendant de la méthode analytique.']),
  parameter('trak', 'thyroid', 'Anticorps anti-récepteurs de la TSH', 'TRAK', 'UI/L', [range('< 1,75 selon méthode', 'UI/L', 'all', undefined, 1.75, true, false)], ['anticorps anti-TSH receptor'], ['Seuil dépendant de la méthode analytique.']),

  parameter('ferritin', 'iron', 'Ferritine', 'Ferritine', 'µg/L', [
    range('30–300', 'µg/L', 'male', 30, 300), range('15–200', 'µg/L', 'female', 15, 200),
  ], ['ferritinémie'], [], ['Valeurs distinctes dans le tableau initial selon le sexe.']),
  parameter('serum-iron', 'iron', 'Fer sérique', 'Fer', 'µmol/L', [
    range('11–30', 'µmol/L', 'male', 11, 30), range('9–27', 'µmol/L', 'female', 9, 27),
  ], ['sidérémie'], [], ['Valeurs distinctes dans le tableau initial selon le sexe.']),
  parameter('transferrin', 'iron', 'Transferrine', 'Transferrine', 'g/L', [range('2–3,6', 'g/L', 'all', 2, 3.6)]),
  parameter('tibc', 'iron', 'Capacité totale de fixation du fer', 'CTF / TIBC', 'µmol/L', [range('45–72', 'µmol/L', 'all', 45, 72)], ['capacité totale de fixation', 'total iron-binding capacity']),
  parameter('transferrin-saturation', 'iron', 'Coefficient de saturation de la transferrine', 'CST', '%', [range('20–40', '%', 'all', 20, 40)], ['saturation de la transferrine']),
];
