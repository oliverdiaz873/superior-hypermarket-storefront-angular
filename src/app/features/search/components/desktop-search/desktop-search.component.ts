import { Component, inject, ViewChild, ElementRef, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchService } from '../../services/search.service';
import { CartService } from '@features/cart/services/cart.service';
import { IconComponent } from '../../../../shared/components/icons/icons.component';


@Component({
  selector: 'app-desktop-search',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, IconComponent],
  templateUrl: './desktop-search.component.html',
  styleUrl: './desktop-search.component.scss'
})
/**
 * DesktopSearchComponent - Componente de búsqueda optimizado para desktop.
 *
 * CARACTERÍSTICAS:
 * - Input expandible: comienza oculto, se expande al activarse.
 * - Dropdown de resultados: mostrado debajo del input con máximo 8 items.
 * - Integración con carrito: botón de carrito con badge de cantidad.
 * - Animaciones: cambios suaves de tamaño y color.
 * - Responsive: se oculta en viewports menores a 1200px.
 * - Accesibilidad: aria-labels con contexto (submit/open/close).
 *
 * LAYOUT DESKTOP:
 * [Search Input (expandible)] [Cart Button] [Language Selector]
 *            ↓
 *   [Dropdown Resultados]
 *
 * ESTILOS:
 * - Input: 400px cuando activo, flex automático.
 * - Resultados: dropdown con scroll, max-height 250px.
 * - Botón: tamaño 6x6, cambia color a rojo cuando activo.
 */
export class DesktopSearchComponent {
  protected searchService = inject(SearchService);
  /** Servicio del carrito (totalItems para badge) */
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

  /** Maneja tecla Enter en el input para enviar la búsqueda */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchService.submitSearch();
    }
  }

  handleResultClick(id: string): void {
    this.searchService.selectResult(id);
  }

  /** Alterna entre abrir/cerrar buscador o enviar la búsqueda según estado */
  handleToggleClick(): void {
    if (this.searchService.isSearchActive()) {
      this.searchService.submitSearch();
    } else {
      this.searchService.toggleSearch();
    }
  }
}
