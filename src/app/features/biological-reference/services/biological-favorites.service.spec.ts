import { afterEach, describe, expect, it } from 'vitest';
import { BiologicalFavoritesService } from './biological-favorites.service';

describe('BiologicalFavoritesService', () => {
  const service = new BiologicalFavoritesService();
  const key = 'medilo-biological-favorites-v1';

  afterEach(() => localStorage.removeItem(key));

  it('persists and restores valid favorites', () => {
    expect(service.write(['potassium', 'creatinine'])).toBeNull();
    expect(service.read()).toEqual({ ids: ['potassium', 'creatinine'], error: null });
  });

  it('reports invalid local data without overwriting it', () => {
    localStorage.setItem(key, '{invalid');
    expect(service.read().error).toContain('Impossible de lire');
    expect(localStorage.getItem(key)).toBe('{invalid');

    localStorage.setItem(key, JSON.stringify(['not-a-biological-parameter']));
    expect(service.read().error).toContain('illisibles');
    expect(localStorage.getItem(key)).toBe(JSON.stringify(['not-a-biological-parameter']));
  });

  it('does not save unknown parameter identifiers', () => {
    expect(service.write(['unknown'])).toContain('paramètre est invalide');
    expect(localStorage.getItem(key)).toBeNull();
  });
});
