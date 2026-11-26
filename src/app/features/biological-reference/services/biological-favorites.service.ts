import { Injectable } from '@angular/core';
import { BIOLOGICAL_PARAMETERS } from '../data/biological-reference.data';

export interface FavoriteReadResult {
  ids: readonly string[];
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class BiologicalFavoritesService {
  private readonly key = 'medilo-biological-favorites-v1';
  private readonly parameterIds = new Set(BIOLOGICAL_PARAMETERS.map((parameter) => parameter.id));

  read(): FavoriteReadResult {
    try {
      const saved = localStorage.getItem(this.key);
      if (saved === null) return { ids: [], error: null };
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every((id) =>
        typeof id === 'string' && this.parameterIds.has(id))) {
        return { ids: [], error: 'Les favoris enregistrés sont illisibles. Ils n’ont pas été modifiés.' };
      }
      return { ids: [...new Set(parsed)], error: null };
    } catch {
      return { ids: [], error: 'Impossible de lire les favoris enregistrés localement.' };
    }
  }

  write(ids: readonly string[]): string | null {
    if (!ids.every((id) => this.parameterIds.has(id))) {
      return 'Les favoris n’ont pas pu être enregistrés : un paramètre est invalide.';
    }
    try {
      localStorage.setItem(this.key, JSON.stringify([...new Set(ids)]));
      return null;
    } catch {
      return 'Impossible d’enregistrer les favoris sur cet appareil.';
    }
  }
}
