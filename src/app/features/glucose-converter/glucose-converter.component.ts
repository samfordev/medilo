import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalculationResult, formatNumber } from '../../core/models/calculation-result';
import {
  classifyGlucoseValue,
  GlucoseConverterService,
  GlucoseRangeStatus,
  GLUCOSE_CONVERSION_FACTOR,
  GLUCOSE_REFERENCE_RANGE_G_PER_L,
  GlucoseUnit,
} from '../../core/services/glucose-converter.service';
import { parsePositiveNumber } from '../../shared/utils/numeric-input';

@Component({
  imports: [FormsModule],
  selector: 'app-glucose-converter',
  templateUrl: './glucose-converter.component.html',
})
export class GlucoseConverterComponent {
  protected value = '';
  protected sourceUnit: GlucoseUnit = 'g/L';

  constructor(private readonly converter: GlucoseConverterService) {}

  protected get targetUnit(): GlucoseUnit {
    return this.sourceUnit === 'g/L' ? 'mmol/L' : 'g/L';
  }

  protected get valueError(): string | null {
    if (this.value === '') {
      return null;
    }
    return parsePositiveNumber(this.value).error;
  }

  protected get result(): CalculationResult | null {
    if (this.value.trim() === '' || this.valueError) {
      return null;
    }
    const value = parsePositiveNumber(this.value).value;
    return value === null ? null : this.converter.convert(value, this.sourceUnit);
  }

  protected get glucoseStatus(): GlucoseRangeStatus | null {
    const value = parsePositiveNumber(this.value).value;
    return value === null || !this.result?.valid
      ? null
      : classifyGlucoseValue(value, this.sourceUnit);
  }

  protected get glucoseValueInGrams(): number | null {
    const enteredValue = parsePositiveNumber(this.value).value;
    const result = this.result;
    if (enteredValue === null || !result?.valid) {
      return null;
    }
    return this.sourceUnit === 'g/L' ? enteredValue : result.rawValue;
  }

  protected get glucoseValueDisplay(): string | null {
    const value = this.glucoseValueInGrams;
    return value === null ? null : formatNumber(value, 2);
  }

  protected get gaugePositionPercent(): number {
    const value = this.glucoseValueInGrams ?? 0;
    const scaleMaximum = GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum * 2;
    return Math.min((value / scaleMaximum) * 100, 100);
  }

  protected get referenceMinimumPercent(): number {
    return (GLUCOSE_REFERENCE_RANGE_G_PER_L.minimum /
      (GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum * 2)) * 100;
  }

  protected get referenceMaximumPercent(): number {
    return (GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum /
      (GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum * 2)) * 100;
  }

  protected get referenceMinimumLabel(): string {
    return formatNumber(GLUCOSE_REFERENCE_RANGE_G_PER_L.minimum, 2);
  }

  protected get referenceMaximumLabel(): string {
    return formatNumber(GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum, 2);
  }

  protected get gaugeMaximumLabel(): string {
    return formatNumber(GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum * 2, 2);
  }

  protected get gaugeAriaLabel(): string {
    const value = this.glucoseValueDisplay;
    const status = this.glucoseStatus;
    const description = status === 'low'
      ? 'sous la plage de référence'
      : status === 'high'
        ? 'au-dessus de la plage de référence'
        : 'dans la plage de référence';
    return `Glycémie ${value} g/L, ${description}. Plage de référence : 0,70 à 1,10 g/L.`;
  }

  protected get referenceRangeLabel(): string {
    const digits = this.sourceUnit === 'g/L' ? 2 : 3;
    const minimum = this.sourceUnit === 'g/L'
      ? GLUCOSE_REFERENCE_RANGE_G_PER_L.minimum
      : GLUCOSE_REFERENCE_RANGE_G_PER_L.minimum * GLUCOSE_CONVERSION_FACTOR;
    const maximum = this.sourceUnit === 'g/L'
      ? GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum
      : GLUCOSE_REFERENCE_RANGE_G_PER_L.maximum * GLUCOSE_CONVERSION_FACTOR;

    return `${formatNumber(minimum, digits)} à ${formatNumber(maximum, digits)} ${this.sourceUnit}`;
  }

  protected flipUnits(): void {
    const entered = parsePositiveNumber(this.value);
    if (entered.value !== null) {
      const currentResult = this.converter.convert(entered.value, this.sourceUnit);
      if (currentResult.rawValue !== null) {
        this.value = String(Number(currentResult.rawValue.toPrecision(15)));
      }
    }
    this.sourceUnit = this.targetUnit;
  }

  protected reset(): void {
    this.value = '';
    this.sourceUnit = 'g/L';
  }
}
