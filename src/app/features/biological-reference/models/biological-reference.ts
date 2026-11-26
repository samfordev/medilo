import type { LucideIcon } from '@lucide/angular';

export type BiologicalSex = 'male' | 'female' | 'all';
export type AlertDirection = 'low' | 'high';
export type AlertSeverity = 'information' | 'warning' | 'critical';

export interface BiologicalCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
  order: number;
}

export interface ReferenceRange {
  label: string;
  sex: BiologicalSex;
  min?: number;
  max?: number;
  minInclusive?: boolean;
  maxInclusive?: boolean;
  unit: string;
  conditions?: string;
}

export interface AlertThreshold {
  label: string;
  direction: AlertDirection;
  value: number;
  unit: string;
  severity: AlertSeverity;
  description: string;
  source: string;
}

export interface BiologicalSource {
  name: string;
  reference: string;
  url?: string;
  lastVerifiedAt?: string;
}

export interface BiologicalParameter {
  id: string;
  categoryId: string;
  name: string;
  abbreviation: string;
  synonyms: readonly string[];
  description: string;
  role: string;
  unit: string;
  alternativeUnits?: readonly string[];
  referenceRanges: readonly ReferenceRange[];
  diagnosticThresholds: readonly ReferenceRange[];
  clinicalNotes: readonly string[];
  alertThresholds: readonly AlertThreshold[];
  interpretation: readonly string[];
  variations: readonly string[];
  precautions: readonly string[];
  sources: readonly BiologicalSource[];
  lastReviewedAt: string | null;
  validationStatus: 'to-verify' | 'verified';
}
