import { Injectable, computed, inject, signal } from '@angular/core';
import { ProductService } from '@features/products/services/product.service';
import { OfferService } from './offer.service';
import { ProductUI } from '@features/products/models/product-ui.interface';

export interface OfferFilterCategory {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
/**
 * Service to manage offer filtering and sorting logic.
 * Encapsulates:
 * - Offer list source (F5.4: real backend via OfferService, no mock)
 * - Category filtering (root category slug, per /offers contract)
 * - Sorting by discount (highest to lowest)
 */
export class OfferFiltersService {
  private readonly productService = inject(ProductService);
  private readonly offerService = inject(OfferService);
  readonly selectedCategory = signal('all');

  readonly categories = computed<OfferFilterCategory[]>(() => {
    return this.productService.categories().map(cat => ({
      id: cat.id,
      name: cat.name,
    }));
  });

  readonly totalProducts = computed(() => this.offerService.offers().length);

  readonly filteredProducts = computed<ProductUI[]>(() => {
    const offers = this.offerService.offers();
    const cat = this.selectedCategory();
    if (cat === 'all') return offers;
    return offers.filter(p => p.categoria === cat);
  });

  readonly sortedProducts = computed<ProductUI[]>(() =>
    [...this.filteredProducts()].sort((a, b) =>
      (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0)
    )
  );

  selectCategory(id: string): void {
    this.selectedCategory.set(id);
  }
}
