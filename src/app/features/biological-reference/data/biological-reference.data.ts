import { BiologicalCategory, BiologicalParameter, BiologicalSex, QualitativeResult, ReferenceRange } from '../models/biological-reference';
import {
  LucideActivity,
  LucideActivitySquare,
  LucideBeaker,
  LucideDroplet,
  LucideFlaskConical,
  LucideHeart,
  LucideHeartPulse,
  LucideMicroscope,
  LucideShieldCheck,
  LucideStethoscope,
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
  { id: 'nutrition', name: 'Équilibre nutritionnel', description: 'Vitamines et marqueurs nutritionnels.', icon: LucideBeaker, iconColor: 'var(--normal-text)', iconBackground: 'var(--normal-bg)', order: 9 },
  { id: 'urinalysis', name: 'Analyse urinaire', description: 'Paramètres biochimiques et cytobactériologiques urinaires.', icon: LucideFlaskConical, iconColor: 'var(--violet-dark)', iconBackground: 'var(--violet-bg)', order: 10 },
  { id: 'endocrine', name: 'Bilan endocrinien', description: 'Hormones et marqueurs endocriniens.', icon: LucideActivitySquare, iconColor: 'var(--turquoise-dark)', iconBackground: 'var(--surface-tint)', order: 11 },
  { id: 'microbiology', name: 'Microbiologie', description: 'Examens microbiologiques et sensibilité aux antimicrobiens.', icon: LucideMicroscope, iconColor: 'var(--green-dark)', iconBackground: 'var(--green-bg)', order: 12 },
  { id: 'immunology', name: 'Immunologie', description: 'Immunoglobulines, complément et auto-anticorps.', icon: LucideShieldCheck, iconColor: 'var(--blue-dark)', iconBackground: 'var(--blue-bg)', order: 13 },
  { id: 'pancreatic-digestive', name: 'Bilan pancréatique et digestif', description: 'Enzymes pancréatiques et marqueurs digestifs.', icon: LucideStethoscope, iconColor: 'var(--orange-dark)', iconBackground: 'var(--orange-bg)', order: 14 },
];

const VARIABLE_REFERENCE_NOTE =
  'Valeurs de référence variables selon le laboratoire et la méthode utilisée. Se référer aux intervalles figurant sur le compte rendu biologique.';

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
  details: {
    description?: string;
    role?: string;
    referenceNotice?: string;
    qualitativeResults?: readonly QualitativeResult[];
  } = {},
): BiologicalParameter {
  return {
    id,
    categoryId,
    name,
    abbreviation,
    synonyms,
    description: details.description ?? 'Description clinique à compléter et à valider médicalement.',
    role: details.role ?? 'Rôle physiologique à documenter et à valider médicalement.',
    unit,
    referenceRanges,
    referenceNotice: details.referenceNotice,
    diagnosticThresholds: [],
    qualitativeResults: details.qualitativeResults,
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

  parameter('monocytes', 'hematology', 'Monocytes', 'MONO', 'G/L', [], ['monocytes absolus'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('eosinophils', 'hematology', 'Éosinophiles', 'EOS', 'G/L', [], ['polynucléaires éosinophiles'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('basophils', 'hematology', 'Basophiles', 'BASO', 'G/L', [], ['polynucléaires basophiles'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('reticulocytes', 'hematology', 'Réticulocytes', 'RET', 'G/L', [], ['réticulocytes absolus'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('rdw', 'hematology', 'Indice de distribution des globules rouges', 'IDR / RDW', '%', [], ['red cell distribution width'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('mch', 'hematology', 'Teneur corpusculaire moyenne en hémoglobine', 'TCMH', 'pg', [], ['teneur moyenne en hémoglobine', 'MCH'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('egfr-ckd-epi', 'renal', 'DFG estimé (CKD-EPI)', 'DFGe', 'mL/min/1,73 m²', [], ['débit de filtration glomérulaire estimé', 'eGFR', 'CKD-EPI'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('creatinine-clearance', 'renal', 'Clairance de la créatinine', 'Clairance créatinine', 'mL/min', [], ['clairance rénale de la créatinine'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('albuminuria', 'renal', 'Albuminurie', 'Albuminurie', 'mg/L', [], ['albumine urinaire'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('urine-albumin-creatinine-ratio', 'renal', 'Rapport albumine/créatinine urinaire', 'RAC urinaire', 'mg/mmol', [], ['rapport albuminurie/créatininurie', 'ACR urinaire'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('ionized-calcium', 'renal', 'Calcium ionisé', 'Ca²⁺', 'mmol/L', [], ['calcémie ionisée'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('plasma-osmolality', 'renal', 'Osmolalité plasmatique', 'Osmolalité', 'mOsm/kg', [], ['osmolarité plasmatique'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('tca', 'metabolic', 'Temps de céphaline activée', 'TCA', 's', [], ['temps de céphaline kaolin', 'aPTT'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('fibrinogen', 'metabolic', 'Fibrinogène', 'Fibrinogène', 'g/L', [], ['fibrinogénémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('d-dimer', 'metabolic', 'D-dimères', 'D-dimères', 'Selon méthode', [], ['dimères D'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('anti-xa-activity', 'metabolic', 'Activité anti-Xa', 'Anti-Xa', 'UI/mL', [], ['activité anti facteur Xa'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('direct-bilirubin', 'liver', 'Bilirubine conjuguée (directe)', 'Bilirubine directe', 'µmol/L', [], ['bilirubine conjuguée'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('indirect-bilirubin', 'liver', 'Bilirubine non conjuguée (indirecte)', 'Bilirubine indirecte', 'µmol/L', [], ['bilirubine non conjuguée'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('ammonia', 'liver', 'Ammoniémie', 'NH₃', 'µmol/L', [], ['ammoniaque sanguin'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('hdl-cholesterol', 'metabolic', 'HDL-cholestérol', 'HDL-c', 'g/L', [], ['cholestérol HDL', 'HDL'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('ldl-cholesterol', 'metabolic', 'LDL-cholestérol', 'LDL-c', 'g/L', [], ['cholestérol LDL', 'LDL'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('non-hdl-cholesterol', 'metabolic', 'Cholestérol non-HDL', 'Non-HDL-c', 'g/L', [], ['cholestérol non HDL'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('procalcitonin', 'metabolic', 'Procalcitonine', 'PCT', 'µg/L', [], ['procalcitonine PCT'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('erythrocyte-sedimentation-rate', 'metabolic', 'Vitesse de sédimentation', 'VS', 'mm/h', [], ['vitesse de sédimentation érythrocytaire', 'ESR'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('vitamin-b12', 'nutrition', 'Vitamine B12', 'Vitamine B12', 'pmol/L', [], ['cobalamine', 'vitamine B12'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('folate', 'nutrition', 'Folates (vitamine B9)', 'Folates', 'nmol/L', [], ['acide folique', 'vitamine B9'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('vitamin-d-25-oh', 'nutrition', 'Vitamine D (25-OH)', '25-OH vitamine D', 'nmol/L', [], ['25-hydroxyvitamine D', 'calcidiol'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('urine-protein', 'urinalysis', 'Protéinurie', 'Protéines urinaires', '', [], ['protéines urinaires'], [], [], {
    description: 'Recherche de protéines dans un échantillon urinaire.',
    role: 'Résultat qualitatif ou semi-quantitatif à interpréter selon la méthode et le contexte clinique.',
    qualitativeResults: [
      { result: 'Négatif', interpretation: 'Aucune protéine détectée par la méthode utilisée.' },
      { result: 'Trace ou positif', interpretation: 'Présence détectée; interprétation à confirmer selon le compte rendu et le contexte clinique.' },
    ],
  }),
  parameter('urine-glucose', 'urinalysis', 'Glycosurie', 'Glucose urinaire', '', [], ['glucose urinaire'], [], [], {
    description: 'Recherche de glucose dans un échantillon urinaire.',
    role: 'Résultat qualitatif ou semi-quantitatif à interpréter selon la méthode et le contexte clinique.',
    qualitativeResults: [
      { result: 'Négatif', interpretation: 'Aucun glucose détecté par la méthode utilisée.' },
      { result: 'Positif', interpretation: 'Glucose détecté; interprétation à corréler aux données cliniques et biologiques.' },
    ],
  }),
  parameter('urine-ketones', 'urinalysis', 'Cétonurie', 'Corps cétoniques urinaires', '', [], ['corps cétoniques urinaires', 'acétonurie'], [], [], {
    description: 'Recherche de corps cétoniques dans un échantillon urinaire.',
    role: 'Résultat qualitatif ou semi-quantitatif à interpréter selon la méthode et le contexte clinique.',
    qualitativeResults: [
      { result: 'Négatif', interpretation: 'Aucun corps cétonique détecté par la méthode utilisée.' },
      { result: 'Positif', interpretation: 'Corps cétoniques détectés; interprétation à corréler au contexte clinique.' },
    ],
  }),
  parameter('urine-blood', 'urinalysis', 'Hématurie', 'Sang urinaire', '', [], ['sang dans les urines'], [], [], {
    description: 'Recherche de sang ou d’hématies dans un échantillon urinaire.',
    role: 'Résultat à confirmer et à interpréter en tenant compte de la méthode de détection.',
    qualitativeResults: [
      { result: 'Négatif', interpretation: 'Aucune détection par la méthode utilisée.' },
      { result: 'Positif', interpretation: 'Détection de sang ou d’hématies; confirmation et interprétation selon le contexte.' },
    ],
  }),
  parameter('urine-leukocytes', 'urinalysis', 'Leucocyturie', 'Leucocytes urinaires', '', [], ['leucocytes urinaires'], [], [], {
    description: 'Recherche de leucocytes dans un échantillon urinaire.',
    role: 'Résultat à interpréter avec les autres éléments de l’analyse urinaire et le contexte clinique.',
    qualitativeResults: [
      { result: 'Négatif', interpretation: 'Aucune détection par la méthode utilisée.' },
      { result: 'Positif', interpretation: 'Leucocytes détectés; interprétation selon l’examen complet et le contexte clinique.' },
    ],
  }),
  parameter('urine-nitrites', 'urinalysis', 'Nitrites urinaires', 'Nitrites', '', [], ['nitriturie'], [], [], {
    description: 'Recherche de nitrites dans un échantillon urinaire.',
    role: 'Résultat qualitatif à interpréter avec l’ensemble de l’analyse urinaire.',
    qualitativeResults: [
      { result: 'Négatif', interpretation: 'Nitrites non détectés; ce résultat seul n’exclut pas une infection.' },
      { result: 'Positif', interpretation: 'Nitrites détectés; interprétation à corréler aux autres résultats et au contexte.' },
    ],
  }),
  parameter('urine-specific-gravity', 'urinalysis', 'Densité urinaire', 'Densité', 'sans unité', [], ['poids spécifique urinaire'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('urine-ph', 'urinalysis', 'pH urinaire', 'pH', 'pH', [], ['acidité urinaire'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('cortisol', 'endocrine', 'Cortisol', 'Cortisol', 'µg/dL', [], ['cortisolémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('acth', 'endocrine', 'Hormone adrénocorticotrope', 'ACTH', 'pg/mL', [], ['corticotrophine'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('pth', 'endocrine', 'Parathormone', 'PTH', 'pg/mL', [], ['hormone parathyroïdienne'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('calcitonin', 'endocrine', 'Calcitonine', 'Calcitonine', 'pg/mL', [], ['calcitoninémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('fsh', 'endocrine', 'Hormone folliculo-stimulante', 'FSH', 'UI/L', [], ['follicle-stimulating hormone'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('lh', 'endocrine', 'Hormone lutéinisante', 'LH', 'UI/L', [], ['luteinizing hormone'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('estradiol', 'endocrine', 'Œstradiol', 'E2', 'pg/mL', [], ['estradiol'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('progesterone', 'endocrine', 'Progestérone', 'Progestérone', 'ng/mL', [], ['progestéronémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('testosterone', 'endocrine', 'Testostérone', 'Testostérone', 'ng/dL', [], ['testostéronémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('prolactin', 'endocrine', 'Prolactine', 'PRL', 'ng/mL', [], ['prolactinémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('blood-cultures', 'microbiology', 'Hémocultures', 'Hémocultures', '', [], ['culture de sang'], [], [], {
    description: 'Culture microbiologique de prélèvements sanguins.',
    role: 'Résultat qualitatif; l’isolement éventuel d’un microorganisme doit être interprété en contexte.',
    qualitativeResults: [
      { result: 'Aucun microorganisme isolé', interpretation: 'Résultat à interpréter selon les conditions et la durée de culture.' },
      { result: 'Microorganisme isolé', interpretation: 'Identification et interprétation clinique à consulter sur le compte rendu.' },
    ],
  }),
  parameter('urine-culture', 'microbiology', 'ECBU', 'ECBU', '', [], ['examen cytobactériologique des urines', 'culture urinaire'], [], [], {
    description: 'Examen cytobactériologique des urines, incluant selon prescription les analyses prévues par le laboratoire.',
    role: 'Résultat qualitatif et interprétatif; interpréter les cultures et éléments associés selon le compte rendu.',
    qualitativeResults: [
      { result: 'Pas de croissance significative rapportée', interpretation: 'Interpréter selon les critères du laboratoire et le contexte clinique.' },
      { result: 'Croissance microbienne rapportée', interpretation: 'Identification et interprétation à partir du compte rendu complet.' },
    ],
  }),
  parameter('cytobacteriological-examination', 'microbiology', 'Examen cytobactériologique', 'ECBA', '', [], ['examen bactériologique de prélèvement'], [], [], {
    description: 'Examen cytobactériologique d’un prélèvement biologique; le type de prélèvement doit être précisé.',
    role: 'Résultat qualitatif et interprétatif, dépendant du prélèvement et de la méthode.',
    qualitativeResults: [
      { result: 'Aucun microorganisme isolé', interpretation: 'Interpréter selon le type de prélèvement et le compte rendu.' },
      { result: 'Microorganisme isolé', interpretation: 'Identification et pertinence clinique à évaluer avec le professionnel de santé.' },
    ],
  }),
  parameter('antibiogram', 'microbiology', 'Antibiogramme', 'Antibiogramme', '', [], ['antibiogramme bactérien'], [], [], {
    description: 'Évaluation in vitro de la sensibilité d’un microorganisme aux antimicrobiens testés.',
    role: 'Résultat interprétatif selon le microorganisme, les antimicrobiens testés et les référentiels en vigueur.',
    qualitativeResults: [
      { result: 'Sensible', interpretation: 'Catégorie définie par le référentiel et les conditions du laboratoire.' },
      { result: 'Sensible à exposition augmentée', interpretation: 'Interprétation selon le référentiel appliqué et le compte rendu.' },
      { result: 'Résistant', interpretation: 'Catégorie définie par le référentiel et les conditions du laboratoire.' },
    ],
  }),

  parameter('igg', 'immunology', 'Immunoglobulines G', 'IgG', 'g/L', [], ['immunoglobuline G'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('iga', 'immunology', 'Immunoglobulines A', 'IgA', 'g/L', [], ['immunoglobuline A'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('igm', 'immunology', 'Immunoglobulines M', 'IgM', 'g/L', [], ['immunoglobuline M'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('ige', 'immunology', 'Immunoglobulines E', 'IgE', 'kUI/L', [], ['immunoglobuline E'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('complement-c3', 'immunology', 'Complément C3', 'C3', 'g/L', [], ['fraction C3 du complément'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('complement-c4', 'immunology', 'Complément C4', 'C4', 'g/L', [], ['fraction C4 du complément'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('rheumatoid-factor', 'immunology', 'Facteur rhumatoïde', 'FR', 'UI/mL', [], ['facteur rhumatoïde sérique'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('anti-ccp-antibodies', 'immunology', 'Anticorps anti-CCP', 'Anti-CCP', 'U/mL', [], ['anticorps anti-peptides citrullinés'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('antinuclear-antibodies', 'immunology', 'Anticorps antinucléaires', 'ANA', 'Selon méthode', [], ['anticorps antinucléaires'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),

  parameter('lipase', 'pancreatic-digestive', 'Lipase', 'Lipase', 'UI/L', [], ['lipasémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('amylase', 'pancreatic-digestive', 'Amylase', 'Amylase', 'UI/L', [], ['amylasémie'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('fecal-elastase', 'pancreatic-digestive', 'Élastase fécale', 'Élastase fécale', 'µg/g', [], ['élastase pancréatique fécale'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
  parameter('fecal-calprotectin', 'pancreatic-digestive', 'Calprotectine fécale', 'Calprotectine', 'µg/g', [], ['calprotectine dans les selles'], [], [], { referenceNotice: VARIABLE_REFERENCE_NOTE }),
];
