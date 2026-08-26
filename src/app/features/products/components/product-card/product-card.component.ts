import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductTranslatePipe } from '../../pipes/product-translate.pipe';
import { AddToCartButtonComponent } from '../../../cart/components/add-to-cart-button/add-to-cart-button.component';
import { cleanPrice, unitLabel } from '../../../../core/utils';
import { OfferBadgeComponent } from '../offer-badge/offer-badge.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ProductTranslatePipe, AddToCartButtonComponent, OfferBadgeComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * ProductCardComponent - Reusable product card.
 * Migrated from Next.js ProductCard with full visual parity.
 */
export class ProductCardComponent {
  private translate = inject(TranslateService);

  @Input() product!: ProductUI;
  @Input() oldPrice?: string;
  @Input() discountPercentage?: number;

  public cleanPrice(text: string): string {
    return cleanPrice(text);
  }

  public get isOffer(): boolean {
    return !!this.oldPrice;
  }

  getUnitLabel(product: ProductUI): string {
    const label = unitLabel(product);
    const key = `common.units.${label}`;
    const translated = this.translate.instant(key);
    const unit = translated !== key ? translated : label;
    if (product.quantity && product.quantity > 1) {
      return `${product.quantity} ${unit}`;
    }
    return unit;
  }
}
