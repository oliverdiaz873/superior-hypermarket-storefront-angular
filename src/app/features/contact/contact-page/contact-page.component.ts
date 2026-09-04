/**
 * ContactPageComponent
 *
 * Smart component that renders the contact page layout.
 * Composes the contact form and business info section.
 * Toggles a dark theme body class on mount/destroy and delegates form
 * submission feedback to ToastService.
 */
import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@features/auth/services/auth.service';
import { OrderApiService } from '@features/orders/services/order-api.service';
import { isValidHelpTopic } from '@features/help/help.content';
import { Order } from '@features/orders/types/order.interface';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [TranslatePipe, RouterLink, ContactFormComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent implements OnInit, OnDestroy {
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly orderApi = inject(OrderApiService);
  private readonly isBrowser: boolean;

  protected helpCategory?: string;
  protected helpTopic?: string;
  protected helpOrderId?: string;
  protected orders: Order[] = [];

  protected get initialName(): string | undefined {
    return this.auth.user()?.name;
  }

  protected get initialEmail(): string | undefined {
    return this.auth.user()?.email;
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      document.body.classList.add('dark-theme-body');
    }
    this.route.queryParamMap.subscribe(params => {
      const cat = params.get('category') ?? undefined;
      const topic = params.get('topic') ?? undefined;
      const orderId = params.get('orderId') ?? undefined;
      if (cat && topic && isValidHelpTopic(cat, topic)) {
        this.helpCategory = cat;
        this.helpTopic = topic;
        this.helpOrderId = orderId;
      } else {
        this.helpCategory = undefined;
        this.helpTopic = undefined;
        this.helpOrderId = undefined;
      }
    });
    // Load orders for selector if authenticated (reuse OrderApiService, backend validates ownership)
    if (this.auth.status() === 'authenticated') {
      this.loadOrders();
    } else {
      // Watch for auth status change (async initialize)
      const check = setInterval(() => {
        if (this.auth.status() === 'authenticated') {
          clearInterval(check);
          this.loadOrders();
        } else if (this.auth.status() === 'anonymous') {
          clearInterval(check);
        }
      }, 300);
      setTimeout(() => clearInterval(check), 5000);
    }
  }

  private loadOrders(): void {
    this.orderApi.list().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = []),
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.body.classList.remove('dark-theme-body');
    }
  }

  showSuccessToast(): void {
    this.toast.success(this.translate.instant('contact.form.success_toast'));
  }
}
