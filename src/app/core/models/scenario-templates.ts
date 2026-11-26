import { Scenario, ScenarioInputStep, ScenarioOperationStep, ScenarioUnit } from './scenario';

export type ScenarioTemplateId = 'infusion' | 'reconstitution' | 'concentration' | 'drops' | 'duration';

export const SCENARIO_TEMPLATES: ReadonlyArray<{ id: ScenarioTemplateId; name: string }> = [
  { id: 'infusion', name: 'Préparation et débit d’une perfusion' },
  { id: 'reconstitution', name: 'Reconstitution d’un médicament' },
  { id: 'concentration', name: 'Calcul d’une concentration' },
  { id: 'drops', name: 'Débit ml/h vers gouttes/min' },
  { id: 'duration', name: 'Durée de perfusion' },
];

function input(id: string, name: string, unit: ScenarioUnit): ScenarioInputStep {
  return { id, name, kind: 'input', value: '', unit, positive: true };
}

function divide(id: string, name: string, left: string, right: string, unit: ScenarioUnit): ScenarioOperationStep {
  return { id, name, kind: 'operation', operation: 'divide', left, right, unit };
}

export function createScenarioTemplate(id: ScenarioTemplateId): Scenario {
  switch (id) {
    case 'infusion':
      return {
        name: 'Préparation et débit d’une perfusion',
        steps: [
          input('prescribed', 'Quantité prescrite', 'mg'),
          input('available', 'Quantité disponible', 'mg'),
          input('reconstitution', 'Volume de reconstitution', 'ml'),
          input('final-volume', 'Volume final', 'ml'),
          input('duration', 'Durée d’administration', 'h'),
          input('factor', 'Calibre perfuseur', 'gouttes/ml'),
          divide('initial-concentration', 'Concentration après reconstitution', 'available', 'reconstitution', 'mg/ml'),
          divide('draw', 'Volume à prélever', 'prescribed', 'initial-concentration', 'ml'),
          divide('final-concentration', 'Concentration finale', 'prescribed', 'final-volume', 'mg/ml'),
          divide('flow', 'Débit horaire', 'final-volume', 'duration', 'ml/h'),
          { id: 'drops', name: 'Débit en gouttes', kind: 'operation', operation: 'multiply', left: 'flow', right: 'factor', unit: 'gouttes/min' },
        ],
      };
    case 'reconstitution':
      return {
        name: 'Reconstitution d’un médicament',
        steps: [
          input('available', 'Quantité disponible', 'mg'),
          input('reconstitution', 'Volume de reconstitution', 'ml'),
          input('prescribed', 'Quantité prescrite', 'mg'),
          divide('concentration', 'Concentration reconstituée', 'available', 'reconstitution', 'mg/ml'),
          divide('draw', 'Volume à prélever', 'prescribed', 'concentration', 'ml'),
        ],
      };
    case 'concentration':
      return {
        name: 'Calcul d’une concentration',
        steps: [
          input('quantity', 'Quantité', 'mg'),
          input('volume', 'Volume', 'ml'),
          divide('concentration', 'Concentration', 'quantity', 'volume', 'mg/ml'),
        ],
      };
    case 'drops':
      return {
        name: 'Débit ml/h vers gouttes/min',
        steps: [
          input('flow', 'Débit horaire', 'ml/h'),
          input('factor', 'Calibre perfuseur', 'gouttes/ml'),
          { id: 'drops', name: 'Débit en gouttes', kind: 'operation', operation: 'multiply', left: 'flow', right: 'factor', unit: 'gouttes/min' },
        ],
      };
    case 'duration':
      return {
        name: 'Durée de perfusion',
        steps: [
          input('volume', 'Volume', 'ml'),
          input('flow', 'Débit horaire', 'ml/h'),
          divide('duration', 'Durée', 'volume', 'flow', 'h'),
        ],
      };
  }
}
