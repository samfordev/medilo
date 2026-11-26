import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application name and navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand strong')?.textContent).toContain('Medilo');
    expect(compiled.querySelector('.main-nav a[href="/scenario"]')?.textContent).toContain('Multi-étapes');
    expect(compiled.querySelector('.main-nav a[href="/fiches-memo"]')?.textContent).toContain('Fiches mémo');
  });

  it('should toggle the dark theme accessibly', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.theme-toggle') as HTMLButtonElement;

    expect(button.getAttribute('aria-pressed')).toBe('false');
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('dark-theme')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Activer le mode clair');

    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('dark-theme')).toBe(false);
  });
});
