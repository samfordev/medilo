import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import { BiologicalReferenceComponent } from './biological-reference.component';

describe('BiologicalReferenceComponent', () => {
  afterEach(() => localStorage.removeItem('medilo-biological-favorites-v1'));

  it('shows all categories and searches by abbreviation', async () => {
    await TestBed.configureTestingModule({
      imports: [BiologicalReferenceComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(BiologicalReferenceComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('.category-card')).toHaveLength(14);
    expect(host.querySelectorAll('.category-icon svg')).toHaveLength(14);
    expect([...host.querySelectorAll('.category-icon svg')].every((icon) => icon.getAttribute('width') === '24')).toBe(true);
    expect(host.textContent).toContain('Analyse urinaire');
    expect(host.textContent).toContain('Bilan endocrinien');
    expect(host.textContent).toContain('Microbiologie');
    expect(host.textContent).toContain('Immunologie');
    expect(host.textContent).toContain('Bilan pancréatique et digestif');
    expect(host.textContent).toContain('Équilibre nutritionnel');
    expect(host.textContent).toContain('Retrouvez rapidement les valeurs biologiques usuelles');
    expect(host.textContent).toContain('Toujours privilégier les intervalles de référence');

    const search = host.querySelector('#biological-search') as HTMLInputElement;
    search.value = 'CRP';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(host.querySelectorAll('.parameter-card')).toHaveLength(1);
    expect(host.querySelector('.parameter-card')?.textContent).toContain('Protéine C-réactive');
    fixture.destroy();
  });
});
