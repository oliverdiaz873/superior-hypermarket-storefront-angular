import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CartItem } from '@features/cart/types/cart.interface';
import { ProductTranslatePipe } from '../../../products/pipes/product-translate.pipe';
import { OfferBadgeComponent } from '../../../products/components/offer-badge/offer-badge.component';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import {
  getAssetUrl,
  cleanPrice,
  formatUnitLabel,
  formatProductPrice,
  type TranslateFn,
  type StructuredUnitInput,
} from '../../../../core/utils';
import { QuantityControlsComponent } from '../quantity-controls/quantity-controls.component';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ProductTranslatePipe, QuantityControlsComponent, OfferBadgeComponent, IconComponent],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Input() isRemoving = false;

  @Output() updateQuantity = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  private translate = inject(TranslateService);

  public get isOffer(): boolean {
    return this.item.isOffer ?? false;
  }

  public get discountPercentage(): number {
    return this.item.discountPercentage ?? 0;
  }

  public getImageUrl(path: string): string {
    return getAssetUrl(path);
  }

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }

  public getDiscountText(): string {
    return this.discountPercentage ? `-${this.discountPercentage}%` : '';
  }

  public getOldPriceDisplay(): string {
    if (!this.item.oldPrice) return '';
    return `$${cleanPrice(this.item.oldPrice)}`;
  }

  private get translateFn(): TranslateFn {
    return (key: string) => this.translate.instant(key);
  }

  private get unitProductLike(): StructuredUnitInput & { precio: number } {
    return {
      precio: this.item.unitPrice,
      unidad: this.item.unitLabel,
      quantity: this.item.unitQuantity,
    };
  }

  getUnitLabel(): string {
    return formatUnitLabel(this.unitProductLike, this.translateFn);
  }

  getPriceText(): string {
    return formatProductPrice(this.unitProductLike, this.translateFn, {
      pricePrefix: this.translate.instant('common.product.price_prefix'),
    });
  }

  public onDecrease(): void {
    this.updateQuantity.emit(-1);
  }

  public onIncrease(): void {
    this.updateQuantity.emit(1);
  }

  public onRemoveClick(): void {
    this.remove.emit();
  }
}
