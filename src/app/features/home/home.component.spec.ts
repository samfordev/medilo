import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import { HomeComponent } from './home.component';
import { HOME_TOOL_ICONS } from '../../core/config/home-tool-icons';

describe('HomeComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('uses the requested available Lucide icons and colors for all tool cards', async () => {
    expect(Object.values(HOME_TOOL_ICONS).map(({ icon }) => icon.icon.name)).toEqual([
      'droplets', 'gauge', 'test-tube', 'workflow', 'book-open',
    ]);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('.tool-card')).toHaveLength(5);
    expect(host.querySelectorAll('.tool-icon svg')).toHaveLength(5);
    expect([...host.querySelectorAll('.tool-icon svg')].every((icon) => icon.getAttribute('width') === '24')).toBe(true);
    expect([...host.querySelectorAll('.tool-icon')].every((icon) =>
      icon.getAttribute('style')?.includes('background-color'))).toBe(true);
    fixture.destroy();
  });
});
