import { Component, Input, Output, EventEmitter, signal, OnChanges, OnDestroy, SimpleChanges, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { LanguageSelectorComponent } from '../../../../shared/components/language-selector/language-selector.component';
import { AccountMenuComponent } from '../../../../shared/components/account-menu/account-menu.component';
import { ProductService } from '@features/products/services/product.service';
import { getUrlFragment } from '../../../../core/utils/url.utils';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, IconComponent, LanguageSelectorComponent, AccountMenuComponent],
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) isOpen = false;
  @Input() showLanguage = true;
  @Output() menuClosed = new EventEmitter<void>();

  private platformId = inject(PLATFORM_ID);
  private readonly productService = inject(ProductService);

  protected readonly categories = this.productService.categories;
  protected openCategory = signal<string | null>(null);
  protected openSubcategories = signal<string[]>([]);

  getFragment(href: string): string {
    return getUrlFragment(href) || href.split('/').filter(Boolean).pop() || '';
  }

  toggleCategory(name: string): void {
    this.openCategory.update(prev => (prev === name ? null : name));
    this.openSubcategories.set([]);
  }

  toggleSubcategory(name: string): void {
    this.openSubcategories.update(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
