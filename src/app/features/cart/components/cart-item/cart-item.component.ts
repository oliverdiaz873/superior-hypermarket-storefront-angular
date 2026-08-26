import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from '@features/cart/types/cart.interface';
import { ProductTranslatePipe } from '../../../products/pipes/product-translate.pipe';
import { OfferBadgeComponent } from '../../../products/components/offer-badge/offer-badge.component';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { cleanPrice } from '../../../../core/utils';
import { QuantityControlsComponent } from '../quantity-controls/quantity-controls.component';

/**
 * CartItem - Individual Cart Item Component
 *
 * Represents a single product in the cart with detailed information:
 * - Product image
 * - Formatted name and price
 * - Offer badge if applicable
 * - Old price if on offer
 * - Unit of measure
 * - Quantity controls
 * - Remove button
 */
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

  public get isOffer(): boolean {
    return this.item.isOffer ?? false;
  }

  public get discountPercentage(): number {
    return this.item.discountPercentage ?? 0;
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
