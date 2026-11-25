import { TestBed } from '@angular/core/testing';
import { signal, type WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from '@core/services/platform.service';
import { AuthService } from '@features/auth/services/auth.service';
import type { AuthStatus, AuthUser } from '@features/auth/types/auth.interface';
import { AccountMenuComponent } from './account-menu.component';

const user: AuthUser = {
  id: '1',
  name: 'Ana López',
  email: 'a@b.com',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('AccountMenuComponent', () => {
  let status: WritableSignal<AuthStatus>;
  let currentUser: WritableSignal<AuthUser | null>;
  let logout: ReturnType<typeof vi.fn>;
  let routerEvents: Subject<unknown>;
  const navigateByUrl = vi.fn();

  beforeEach(() => {
    status = signal<AuthStatus>('loading');
    currentUser = signal<AuthUser | null>(null);
    logout = vi.fn(() => of(undefined));
    routerEvents = new Subject<unknown>();
    navigateByUrl.mockReset();

    TestBed.configureTestingModule({
      imports: [AccountMenuComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            status: () => status(),
            user: () => currentUser(),
            initials: () => 'AL',
            logout,
          },
        },
        { provide: PlatformService, useValue: { isBrowser: () => true } },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
            events: routerEvents.asObservable(),
            createUrlTree: vi.fn(() => ({})),
            serializeUrl: vi.fn(() => ''),
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } }, url: of(null) } },
        { provide: TranslateService, useValue: { instant: (key: string): string => key, translate: (key: string) => () => key } },
      ],
    });
  });

  const render = (variant: 'desktop' | 'mobile' = 'desktop') => {
    const fixture = TestBed.createComponent(AccountMenuComponent);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
    return fixture;
  };

  const text = (fixture: ReturnType<typeof render>) => fixture.nativeElement.textContent as string;

  it('renders a skeleton while the session is loading', () => {
    const fixture = render();
    expect(fixture.nativeElement.querySelector('.account-menu__skeleton')).toBeTruthy();
  });

  it('renders the mobile skeleton variant', () => {
    const fixture = render('mobile');
    expect(fixture.nativeElement.querySelector('.account-menu__skeleton--mobile')).toBeTruthy();
  });

  it('shows the anonymous trigger with greeting and account label', () => {
    status.set('anonymous');
    const fixture = render();

    const trigger = fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-label')).toBe('header.account.open_account');
    expect(text(fixture)).toContain('header.account.greeting');
    expect(text(fixture)).toContain('header.account.account');
  });

  it('opens the anonymous panel with welcome and auth actions', () => {
    status.set('anonymous');
    const fixture = render();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.account-menu__panel') as HTMLElement;
    expect(panel.classList.contains('is-open')).toBe(false);

    (fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(panel.classList.contains('is-open')).toBe(true);
    expect(text(fixture)).toContain('header.account.welcome_title');
    expect(text(fixture)).toContain('header.account.login');
    expect(text(fixture)).toContain('header.account.create_account');
  });

  it('shows the authenticated trigger and opens the account panel', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = render();
    (fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    const t = text(fixture);
    expect(t).toContain('header.account.greeting_named');
    expect(t).toContain('header.account.account');
    expect(t).toContain('footer.links.orders');
    expect(t).toContain('footer.links.addresses');
    expect(t).toContain('header.account.logout');
    expect(t).not.toContain('header.account.login');
  });

  it('closes the panel on Escape and returns focus to the trigger', () => {
    status.set('anonymous');
    const fixture = render();
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes the panel on outside pointerdown', () => {
    status.set('anonymous');
    const fixture = render();
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the panel on navigation', () => {
    status.set('anonymous');
    const fixture = render();
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    routerEvents.next(new NavigationEnd(1, '/es', '/es'));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('logs out and emits navigated without navigating away', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = render();
    const navigated = vi.fn();
    fixture.componentInstance.navigated.subscribe(navigated);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('.account-menu__item--logout') as HTMLButtonElement;
    logoutButton.click();
    fixture.detectChanges();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigated).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('renders the inline card for the mobile variant without a trigger', () => {
    status.set('anonymous');
    const fixture = render('mobile');

    expect(fixture.nativeElement.querySelector('.account-menu__trigger')).toBeNull();
    expect(fixture.nativeElement.querySelector('.account-menu__panel')).toBeNull();
    expect(fixture.nativeElement.querySelector('.account-menu__card')).toBeTruthy();
    expect(text(fixture)).toContain('header.account.welcome_title');
    expect(text(fixture)).toContain('header.account.login');
    expect(text(fixture)).toContain('header.account.create_account');
  });

  it('renders the authenticated mobile card and emits navigated on link click', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = render('mobile');
    const navigated = vi.fn();
    fixture.componentInstance.navigated.subscribe(navigated);
    fixture.detectChanges();

    const link = Array.from(
      fixture.nativeElement.querySelectorAll('.account-menu__card a') as NodeListOf<HTMLAnchorElement>,
    ).find((a) => a.textContent?.includes('header.account.account'));
    link?.click();

    expect(navigated).toHaveBeenCalledTimes(1);
    expect(text(fixture)).toContain('header.account.logout');
  });
});
