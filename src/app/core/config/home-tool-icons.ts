import {
  LucideBookOpen,
  LucideDroplets,
  LucideGauge,
  LucideTestTube,
  LucideWorkflow,
  LucideIcon,
} from '@lucide/angular';

export type HomeToolId = 'drip-rate' | 'flow-rate' | 'glucose-converter' | 'scenario' | 'biological-reference';

export interface HomeToolIcon {
  icon: LucideIcon;
  color: string;
  background: string;
}

export const HOME_TOOL_ICONS: Readonly<Record<HomeToolId, HomeToolIcon>> = {
  'drip-rate': { icon: LucideDroplets, color: 'var(--teal-dark)', background: 'var(--mint)' },
  'flow-rate': { icon: LucideGauge, color: 'var(--turquoise-dark)', background: 'var(--surface-tint)' },
  'glucose-converter': { icon: LucideTestTube, color: 'var(--warning-text)', background: 'var(--warning-bg)' },
  scenario: { icon: LucideWorkflow, color: 'var(--danger)', background: 'var(--danger-bg)' },
  'biological-reference': { icon: LucideBookOpen, color: 'var(--normal-text)', background: 'var(--normal-bg)' },
};
