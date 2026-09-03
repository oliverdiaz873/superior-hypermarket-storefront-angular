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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthService } from '@features/auth/services/auth.service';

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
  private readonly isBrowser: boolean;

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
