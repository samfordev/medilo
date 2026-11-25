import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalculationResult } from '../../core/models/calculation-result';
import { FlowRateCalculatorService } from '../../core/services/flow-rate-calculator.service';
import {
  parseOptionalNonNegativeNumber,
  parsePositiveNumber,
} from '../../shared/utils/numeric-input';

@Component({
  imports: [FormsModule],
  selector: 'app-flow-rate',
  templateUrl: './flow-rate.component.html',
})
export class FlowRateComponent {
  protected volume = '';
  protected hours = '';
  protected minutes = '';

  constructor(private readonly calculator: FlowRateCalculatorService) {}

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
    return this.calculator.calculate(volume, hours * 60 + minutes);
  }

  protected reset(): void {
    this.volume = '';
    this.hours = '';
    this.minutes = '';
  }
}
