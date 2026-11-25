import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlatformService } from '@core/services/platform.service';
import { IconComponent } from '../icons/icons.component';
import { AuthService } from '@features/auth/services/auth.service';

let instanceSeq = 0;

/**
 * Zona de cuenta del header (patrón disclosure), con paridad visual y
 * funcional respecto a la versión Next.js auditada:
 * - loading      → skeleton (SSR y primer render pintan lo mismo).
 * - anonymous    → trigger "Hola, bienvenido / Mi cuenta" + panel de bienvenida.
 * - authenticated → avatar + saludo con nombre + accesos reales de cuenta.
 * variant="mobile" renderiza una tarjeta inline dentro del drawer (MobileNav).
 */
@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss',
})
export class AccountMenuComponent {
  /** 'desktop' = trigger + dropdown en el header; 'mobile' = tarjeta inline en el drawer. */
  @Input() variant: 'desktop' | 'mobile' = 'desktop';
  /** Emitido al navegar o cerrar sesión desde la variante mobile (cierra el drawer). */
  @Output() navigated = new EventEmitter<void>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platform = inject(PlatformService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly status = this.auth.status;
  protected readonly user = this.auth.user;
  protected readonly initials = this.auth.initials;
  protected readonly isOpen = signal(false);
  protected readonly pending = signal(false);
  protected readonly isMobile = computed(() => this.variant === 'mobile');
  protected readonly panelId = `account-menu-panel-${++instanceSeq}`;

  protected readonly firstName = computed(() => this.user()?.name.trim().split(/\s+/)[0] ?? '');
  protected readonly greeting = computed(() =>
    this.user()
      ? { key: 'header.account.greeting_named', params: { name: this.firstName() } }
      : { key: 'header.account.greeting', params: {} },
  );

  constructor() {
    // Cierra el panel al navegar (equivalente al ajuste por pathname en Next).
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.isOpen.set(false));

    if (this.platform.isBrowser() && isPlatformBrowser(this.platformId)) {
      const closeOnPointerDown = (event: PointerEvent): void => {
        if (this.isMobile() || !this.isOpen()) return;
        const target = event.target as Node | null;
        if (!this.elementRef.nativeElement.contains(target)) {
          this.isOpen.set(false);
        }
      };
      const closeOnEscape = (event: KeyboardEvent): void => {
        if (this.isMobile() || !this.isOpen() || event.key !== 'Escape') return;
        this.isOpen.set(false);
        this.triggerElement()?.focus();
      };
      document.addEventListener('pointerdown', closeOnPointerDown);
      document.addEventListener('keydown', closeOnEscape);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('pointerdown', closeOnPointerDown);
        document.removeEventListener('keydown', closeOnEscape);
      });
    }
  }

  protected toggle(): void {
    this.isOpen.update((open) => !open);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  /** Navegación desde la tarjeta mobile: cierra el drawer. */
  protected onNavigate(): void {
    this.navigated.emit();
  }

  protected logout(): void {
    if (this.pending()) return;
    this.pending.set(true);
    this.auth.logout().subscribe({
      next: () => {
        this.pending.set(false);
        this.isOpen.set(false);
        this.navigated.emit();
      },
      error: () => this.pending.set(false),
    });
  }

  private triggerElement(): HTMLButtonElement | null {
    return this.elementRef.nativeElement.querySelector<HTMLButtonElement>('.account-menu__trigger');
  }
}
