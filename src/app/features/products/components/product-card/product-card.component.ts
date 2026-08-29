import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductTranslatePipe } from '../../pipes/product-translate.pipe';
import { AddToCartButtonComponent } from '../../../cart/components/add-to-cart-button/add-to-cart-button.component';
import {
  cleanPrice,
  getAssetUrl,
  formatUnitLabel,
  formatProductPrice,
  formatPricePerUnit,
  type TranslateFn,
} from '../../../../core/utils';
import { OfferBadgeComponent } from '../offer-badge/offer-badge.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ProductTranslatePipe, AddToCartButtonComponent, OfferBadgeComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  private translate = inject(TranslateService);

  @Input() product!: ProductUI;
  @Input() oldPrice?: string;
  @Input() discountPercentage?: number;

  public cleanPrice(text: string): string {
    return cleanPrice(text);
  }

  public getAssetUrl(path: string): string {
    return getAssetUrl(path);
  }

  public get isOffer(): boolean {
    return !!this.oldPrice;
  }

  private get translateFn(): TranslateFn {
    return (key: string) => this.translate.instant(key);
  }

  getUnitLabel(product: ProductUI): string {
    return formatUnitLabel(product, this.translateFn);
  }

  getUnitPriceLabel(product: ProductUI): string {
    return formatPricePerUnit(product, this.translateFn);
  }

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString('en-US')}`;
  }

  getPriceText(product: ProductUI): string {
    return formatProductPrice(product, this.translateFn, {
      pricePrefix: this.translate.instant('common.product.price_prefix'),
    });
  }
}
