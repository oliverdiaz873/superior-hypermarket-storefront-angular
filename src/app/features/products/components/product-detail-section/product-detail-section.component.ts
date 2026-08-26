import { Component, Input, inject, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductPageData } from '../../../../data/product-page.data';
import { ProductTranslatePipe } from '../../pipes/product-translate.pipe';
import { AddToCartButtonComponent } from '../../../cart/components/add-to-cart-button/add-to-cart-button.component';
import { ProductTranslationService } from '../../services/product-translation.service';

/**
 * ProductDetailSection - Main product detail section.
 * Displays product image with lightbox modal, name, price,
 * rich description, technical detail bullet points, and
 * an add-to-cart button.
 */
@Component({
  selector: 'app-product-detail-section',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProductTranslatePipe, AddToCartButtonComponent],
  templateUrl: './product-detail-section.component.html',
  styleUrl: './product-detail-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailSectionComponent {
  @Input({ required: true }) product!: ProductUI;
  @Input() pageData?: ProductPageData;


  readonly productTranslation = inject(ProductTranslationService);
  private platformId = inject(PLATFORM_ID);

  get description(): string {
    return this.productTranslation.getDescription(this.product, this.pageData);
  }

  get specs(): string[] {
    return this.productTranslation.getSpecs(this.product, this.pageData);
  }

  @ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLElement>;

  public modalOpen = false;
  private previousActiveElement: HTMLElement | null = null;

  public openModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.previousActiveElement = document.activeElement as HTMLElement;
    }
    this.modalOpen = true;
    this.closeBtn?.nativeElement?.focus();
  }

  public closeModal(): void {
    this.modalOpen = false;
    this.previousActiveElement?.focus();
    this.previousActiveElement = null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.modalOpen) return;

    if (event.key === 'Escape') {
      this.closeModal();
      return;
    }

    if (event.key === 'Tab' && this.modalContainer) {
      const focusable = this.modalContainer.nativeElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first?.focus();
          event.preventDefault();
        }
      }
    }
  }
}
