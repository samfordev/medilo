import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BiologicalFavoritesService } from './services/biological-favorites.service';
import { BiologicalReferenceService } from './services/biological-reference.service';
import { BiologicalCategory, BiologicalParameter, BiologicalSex } from './models/biological-reference';

@Component({
  selector: 'app-biological-reference',
  imports: [FormsModule, NgComponentOutlet, RouterLink],
  templateUrl: './biological-reference.component.html',
  styleUrl: './biological-reference.component.scss',
})
export class BiologicalReferenceComponent {
  protected query = '';
  protected favoriteIds: readonly string[];
  protected favoriteError: string | null;

  constructor(
    protected readonly reference: BiologicalReferenceService,
    private readonly favorites: BiologicalFavoritesService,
    private readonly route: ActivatedRoute,
  ) {
    const saved = this.favorites.read();
    this.favoriteIds = saved.ids;
    this.favoriteError = saved.error;
    this.query = this.route.snapshot.queryParamMap.get('search') ?? '';
  }

  protected get categoryId(): string | null {
    return this.route.snapshot.paramMap.get('categoryId');
  }

  protected get parameterId(): string | null {
    return this.route.snapshot.paramMap.get('parameterId');
  }

  protected get view(): string {
    return this.route.snapshot.data['view'] ?? '';
  }

  protected get category(): BiologicalCategory | undefined {
    return this.reference.category(this.categoryId);
  }

  protected get parameter(): BiologicalParameter | undefined {
    return this.reference.parameter(this.parameterId);
  }

  protected get returnLink(): string {
    const origin = this.route.snapshot.queryParamMap.get('from');
    if (origin === 'favorites') return '/fiches-memo-bio/favoris';
    if (origin === 'category') {
      const categoryId = this.route.snapshot.queryParamMap.get('categoryId');
      if (this.reference.category(categoryId)) return `/fiches-memo-bio/categorie/${categoryId}`;
    }
    if (origin === 'search') return '/fiches-memo-bio';
    return this.parameter ? `/fiches-memo-bio/categorie/${this.parameter.categoryId}` : '/fiches-memo-bio';
  }

  protected get returnLabel(): string {
    const origin = this.route.snapshot.queryParamMap.get('from');
    if (origin === 'favorites') return 'Retour aux favoris';
    if (origin === 'search') return 'Retour aux résultats';
    if (origin === 'category') {
      const category = this.reference.category(this.route.snapshot.queryParamMap.get('categoryId'));
      if (category) return `Retour à ${category.name}`;
    }
    return this.parameter
      ? `Retour à ${this.reference.category(this.parameter.categoryId)?.name ?? 'la catégorie'}`
      : 'Retour aux catégories';
  }

  protected get returnQueryParams(): { search: string } | null {
    if (this.route.snapshot.queryParamMap.get('from') !== 'search') return null;
    const search = this.route.snapshot.queryParamMap.get('search');
    return search ? { search } : null;
  }

  protected get searchResults(): readonly BiologicalParameter[] {
    return this.reference.search(this.query);
  }

  protected get favoriteParameters(): readonly BiologicalParameter[] {
    return this.favoriteIds
      .map((id) => this.reference.parameter(id))
      .filter((parameter): parameter is BiologicalParameter => parameter !== undefined);
  }

  protected get groupedSearchResults(): readonly { category: BiologicalCategory; parameters: readonly BiologicalParameter[] }[] {
    return this.reference.categories
      .map((category) => ({
        category,
        parameters: this.searchResults.filter((parameter) => parameter.categoryId === category.id),
      }))
      .filter((group) => group.parameters.length > 0);
  }

  protected isFavorite(parameterId: string): boolean {
    return this.favoriteIds.includes(parameterId);
  }

  protected toggleFavorite(parameterId: string): void {
    if (this.favoriteError) return;
    const next = this.isFavorite(parameterId)
      ? this.favoriteIds.filter((id) => id !== parameterId)
      : [...this.favoriteIds, parameterId];
    this.favoriteError = this.favorites.write(next);
    if (!this.favoriteError) this.favoriteIds = next;
  }

  protected categoryCount(categoryId: string): number {
    return this.reference.parametersInCategory(categoryId).length;
  }

  protected parameterReferenceSummary(parameter: BiologicalParameter): string {
    if (parameter.referenceRanges.length) return parameter.referenceRanges[0].label;
    if (parameter.referenceNotice) return 'Référence selon le laboratoire';
    if (parameter.qualitativeResults?.length) return 'Résultats qualitatifs';
    return 'Valeur non renseignée';
  }

  protected parameterUnitSummary(parameter: BiologicalParameter): string {
    if (parameter.unit) return parameter.unit;
    if (parameter.qualitativeResults?.length) return 'Non applicable (qualitatif)';
    return 'Unité non précisée';
  }

  protected sexLabel(sex: BiologicalSex): string {
    switch (sex) {
      case 'male': return 'Homme';
      case 'female': return 'Femme';
      case 'all': return 'Tous';
    }
  }

  protected parameterLink(parameter: BiologicalParameter): string {
    return `/fiches-memo-bio/${parameter.id}`;
  }

  protected parameterReturnQuery(from: 'category' | 'favorites' | 'search', categoryId?: string): {
    from: string;
    categoryId?: string;
    search?: string;
  } {
    if (from === 'category') return { from, categoryId: categoryId ?? '' };
    if (from === 'search') return { from, search: this.query };
    return { from };
  }
}
