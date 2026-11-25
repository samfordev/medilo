import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GlucoseConverterComponent } from './glucose-converter.component';

describe('GlucoseConverterComponent', () => {
  it('keeps the entered glucose value attached to its unit when swapping', async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseConverterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GlucoseConverterComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#glucose-value') as HTMLInputElement;
    const output = fixture.nativeElement.querySelector('#glucose-result') as HTMLInputElement;
    input.value = '1,20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(output.value).toBe('6,66');

    (fixture.nativeElement.querySelector('.swap-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(input.value).toBe('6.66');
    expect(output.value).toBe('1,20');
  });

  it('clears the previous result when the input becomes invalid', async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseConverterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GlucoseConverterComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#glucose-value') as HTMLInputElement;
    const output = fixture.nativeElement.querySelector('#glucose-result') as HTMLInputElement;
    input.value = '1.2';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    input.value = '-1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(output.value).toBe('');
    expect(fixture.nativeElement.querySelector('.field-error')?.textContent).toContain(
      'strictement supérieur à zéro',
    );
  });

  it('shows a reference-range alert and updates it when units are inverted', async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseConverterComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GlucoseConverterComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#glucose-value') as HTMLInputElement;

    input.value = '0,69';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const gauge = fixture.nativeElement.querySelector('.gauge-track') as HTMLDivElement;
    const marker = fixture.nativeElement.querySelector('.gauge-marker') as HTMLSpanElement;
    const initialPosition = Number.parseFloat(marker.style.left);

    expect(gauge.getAttribute('aria-label')).toContain('0,69 g/L');
    expect(initialPosition).toBeCloseTo((0.69 / 2.2) * 100, 4);
    expect(fixture.nativeElement.querySelector('.notice--warning')?.textContent).toContain(
      'Hypoglycémie',
    );

    (fixture.nativeElement.querySelector('.swap-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.notice--warning')?.textContent).toContain(
      'Hypoglycémie',
    );
    expect(fixture.nativeElement.querySelector('.notice--warning')?.textContent).toContain(
      'mmol/L',
    );
    expect(Number.parseFloat(marker.style.left)).toBeCloseTo(initialPosition, 4);
  });
});
