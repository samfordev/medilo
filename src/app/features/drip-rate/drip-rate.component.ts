import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalculationResult } from '../../core/models/calculation-result';
import {
  DripRateCalculatorService,
  DRIP_FACTORS,
  InfusionType,
} from '../../core/services/drip-rate-calculator.service';
import {
  parseOptionalNonNegativeNumber,
  parsePositiveNumber,
} from '../../shared/utils/numeric-input';

@Component({
  imports: [FormsModule],
  selector: 'app-drip-rate',
  templateUrl: './drip-rate.component.html',
})
export class DripRateComponent {
  protected volume = '';
  protected hours = '';
  protected minutes = '';
  protected infusionType: InfusionType = 'standard';

  constructor(private readonly calculator: DripRateCalculatorService) {}

  protected get factor(): number {
    return DRIP_FACTORS[this.infusionType];
  }

  protected get rawValueDisplay(): string | null {
    const rawValue = this.result?.rawValue;
    return rawValue === null || rawValue === undefined
      ? null
      : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 4 }).format(rawValue);
  }

  protected get shouldShowErrors(): boolean {
    return this.volume !== '' || this.hours !== '' || this.minutes !== '';
  }

  protected get volumeError(): string | null {
    if (!this.shouldShowErrors) {
      return null;
    }
    if (this.volume.trim() === '') {
      return 'Le volume est requis.';
    }
    return parsePositiveNumber(this.volume).error;
  }

  protected get durationError(): string | null {
    if (!this.shouldShowErrors) {
      return null;
    }
    if (this.hours.trim() === '' && this.minutes.trim() === '') {
      return 'Indiquez une durée en heures ou en minutes.';
    }

    const hours = parseOptionalNonNegativeNumber(this.hours);
    const minutes = parseOptionalNonNegativeNumber(this.minutes);
    if (hours.error || minutes.error) {
      return hours.error ?? minutes.error;
    }
    const total = (hours.value ?? 0) * 60 + (minutes.value ?? 0);
    return total > 0 ? null : 'La durée totale doit être supérieure à zéro.';
  }

  protected get result(): CalculationResult | null {
    if (!this.shouldShowErrors || this.volumeError || this.durationError) {
      return null;
    }
    const volume = parsePositiveNumber(this.volume).value;
    const hours = parseOptionalNonNegativeNumber(this.hours).value ?? 0;
    const minutes = parseOptionalNonNegativeNumber(this.minutes).value ?? 0;
    if (volume === null) {
      return null;
    }
    return this.calculator.calculate(volume, hours * 60 + minutes, this.infusionType);
  }

  protected reset(): void {
    this.volume = '';
    this.hours = '';
    this.minutes = '';
    this.infusionType = 'standard';
  }
}
