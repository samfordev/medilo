import { Injectable } from '@angular/core';
import { BIOLOGICAL_CATEGORIES, BIOLOGICAL_PARAMETERS } from '../data/biological-reference.data';
import { BiologicalCategory, BiologicalParameter } from '../models/biological-reference';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
}

@Injectable({ providedIn: 'root' })
export class BiologicalReferenceService {
  readonly categories = BIOLOGICAL_CATEGORIES;
  readonly parameters = BIOLOGICAL_PARAMETERS;

  category(id: string | null): BiologicalCategory | undefined {
    return this.categories.find((category) => category.id === id);
  }

  parameter(id: string | null): BiologicalParameter | undefined {
    return this.parameters.find((parameter) => parameter.id === id);
  }

  parametersInCategory(categoryId: string): readonly BiologicalParameter[] {
    return this.parameters.filter((parameter) => parameter.categoryId === categoryId);
  }

  search(query: string): readonly BiologicalParameter[] {
    const term = normalize(query);
    if (!term) return [];
    return this.parameters.filter((parameter) =>
      [parameter.name, parameter.abbreviation, parameter.unit, ...parameter.synonyms]
        .some((value) => normalize(value).includes(term)),
    );
  }
}
