import { Component, inject, ViewChild, ElementRef, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchService } from '../../services/search.service';
import { CartService } from '@features/cart/services/cart.service';
import { IconComponent } from '../../../../shared/components/icons/icons.component';


@Component({
  selector: 'app-mobile-search',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, TranslatePipe],
  templateUrl: './mobile-search.component.html',
  styleUrl: './mobile-search.component.scss'
})
/**
 * Componente de búsqueda optimizado para mobile (< 768px).
 *
 * CARACTERÍSTICAS:
 * - Input a pantalla completa: cuando activo, ocupa todo el ancho disponible
 * - Carrito oculto: se oculta al activar búsqueda para ahorrar espacio
 * - Dropdown contextual: resultados ajustados al ancho de pantalla
 * - Scroll automático: lista de resultados con scroll independiente
 * - Mayor área de toque: items con padding optimizado para dedos
 * - Búsqueda rápida: focus automático para empezar a escribir
 *
 * LAYOUT MOBILE (< 768px):
 * [Menu] [Search Button]
 *          ↓ (cuando activo)
 * [Search Input (full width)]
 *    ↓
 * [Dropdown Resultados (responsive)]
 *
 * DEPENDENCIAS:
 * - SearchService: searchTerm, isSearchActive, searchResults
 * - CartService: totalItems para badge del carrito
 *
 * @component
 * @usageNote Renderizado condicional cuando viewportMode === 'mobile'
 */
export class MobileSearchComponent {
  protected searchService = inject(SearchService);
  protected cartService = inject(CartService);
  

  @ViewChild('searchInput', { read: ElementRef })
  searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('resultsList', { read: ElementRef })
  resultsList!: ElementRef<HTMLUListElement>;

  constructor() {
    effect(() => {
      if (this.searchService.isSearchActive()) {
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
      }
    });
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (
      this.resultsList &&
      !this.resultsList.nativeElement.contains(event.target as Node)
    ) {
      this.searchService.setSearchTerm('');
    }
  }

  handleInput(event: Event): void {
    this.searchService.setSearchTerm((event.target as HTMLInputElement).value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchService.submitSearch();
    }
  }

  handleResultClick(id: string): void {
    this.searchService.selectResult(id);
  }

  handleToggleClick(): void {
    if (this.searchService.isSearchActive()) {
      this.searchService.submitSearch();
    } else {
      this.searchService.toggleSearch();
    }
  }
}
