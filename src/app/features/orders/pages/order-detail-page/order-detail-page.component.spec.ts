import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OrderDetailPageComponent } from './order-detail-page.component';
import { OrderApiService } from '../../services/order-api.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import type { Order } from '../../types/order.interface';

const baseOrder: Order = {
  id: 'ord-1',
  userId: 'u-1',
  orderNumber: 'HM-20260812-000001',
  items: [
    {
      productId: 'prod-1',
      name: 'Leche',
      price: 1125,
      originalPrice: 1500,
      image: 'leche.jpg',
      quantity: 2,
    },
  ],
  shippingAddress: { street: 'Calle 1', city: 'Santo Domingo', country: 'República Dominicana' },
  totalItems: 2,
  subtotal: 2250,
  status: 'pending',
  paymentStatus: 'pending',
  statusHistory: [{ status: 'pending', changedAt: '2026-08-12T10:00:00.000Z' }],
  createdAt: '2026-08-12T10:00:00.000Z',
  updatedAt: '2026-08-12T10:00:00.000Z',
};

describe('OrderDetailPageComponent', () => {
  let api: {
    getById: ReturnType<typeof vi.fn>;
    pay: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
  };
  let toast: { error: ReturnType<typeof vi.fn>; success: ReturnType<typeof vi.fn> };
  let translate: Record<string, unknown>;

  function configure(order: Order): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [OrderDetailPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: (key: string) => (key === 'id' ? order.id : null) } } },
        },
        { provide: OrderApiService, useValue: api },
        { provide: ToastService, useValue: toast },
        { provide: TranslateService, useValue: translate },
      ],
    });
  }

  beforeEach(() => {
    api = {
      getById: vi.fn(() => of(baseOrder)),
      pay: vi.fn(() => of(baseOrder)),
      cancel: vi.fn(() => of(baseOrder)),
    };
    toast = { error: vi.fn(), success: vi.fn() };
    translate = {
      instant: vi.fn((key: string) => key),
      get: vi.fn(() => of('')),
      stream: vi.fn(() => of('')),
      translate: vi.fn((key: string) => () => key),
      currentLang: 'es',
      onLangChange: { subscribe: vi.fn() },
      onTranslationChange: { subscribe: vi.fn() },
      onDefaultLangChange: { subscribe: vi.fn() },
      defaultLang: 'es',
      addLangs: vi.fn(),
      getLangs: vi.fn(() => ['es', 'en']),
      setDefaultLang: vi.fn(),
      use: vi.fn(),
      reloadLang: vi.fn(),
      resetLang: vi.fn(),
      getBrowserLang: vi.fn(() => 'es'),
      getBrowserCultureLang: vi.fn(() => 'es-ES'),
      setTranslation: vi.fn(),
      getTranslation: vi.fn(() => Promise.resolve({})),
    };
  });

  it('loads and renders the order detail', () => {
    configure(baseOrder);
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();

    expect(api.getById).toHaveBeenCalledWith('ord-1');
    expect(fixture.componentInstance.order()).toEqual(baseOrder);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('HM-20260812-000001');
  });

  it('canPay is true only when paymentStatus is pending', () => {
    const paid = { ...baseOrder, paymentStatus: 'paid' as const };
    configure(baseOrder);
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.canPay()).toBe(true);

    fixture.componentInstance.order.set(paid);
    expect(fixture.componentInstance.canPay()).toBe(false);
  });

  it('canCancel is true only when status is pending or confirmed', () => {
    configure(baseOrder);
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.canCancel()).toBe(true);

    component.order.set({ ...baseOrder, status: 'confirmed' });
    expect(component.canCancel()).toBe(true);

    component.order.set({ ...baseOrder, status: 'shipped' });
    expect(component.canCancel()).toBe(false);
  });

  it('pay() calls POST /pay and refreshes from the server', () => {
    const paidOrder = { ...baseOrder, paymentStatus: 'paid' as const };
    let current: Order = baseOrder;
    api.pay = vi.fn(() => {
      current = paidOrder;
      return of(paidOrder);
    });
    api.getById = vi.fn(() => of(current));
    configure(baseOrder);
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onPay();
    expect(api.pay).toHaveBeenCalledWith('ord-1');
    expect(fixture.componentInstance.order()?.paymentStatus).toBe('paid');
  });

  it('pay() does nothing when paymentStatus is not pending', () => {
    const paidOrder = { ...baseOrder, paymentStatus: 'paid' as const };
    api.getById = vi.fn(() => of(paidOrder));
    configure({ ...baseOrder, paymentStatus: 'paid' });
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onPay();
    expect(api.pay).not.toHaveBeenCalled();
  });

  it('cancel() calls PATCH /status and a paid order becomes refunded', () => {
    const cancelledOrder = {
      ...baseOrder,
      status: 'cancelled' as const,
      paymentStatus: 'refunded' as const,
    };
    let current: Order = baseOrder;
    api.cancel = vi.fn(() => {
      current = cancelledOrder;
      return of(cancelledOrder);
    });
    api.getById = vi.fn(() => of(current));
    configure(baseOrder);
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onCancel();
    expect(api.cancel).toHaveBeenCalledWith('ord-1');
    expect(fixture.componentInstance.order()?.status).toBe('cancelled');
    expect(fixture.componentInstance.order()?.paymentStatus).toBe('refunded');
  });

  it('cancel() does nothing when the order can no longer be cancelled', () => {
    const completedOrder = { ...baseOrder, status: 'completed' as const };
    api.getById = vi.fn(() => of(completedOrder));
    configure({ ...baseOrder, status: 'completed' });
    const fixture = TestBed.createComponent(OrderDetailPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onCancel();
    expect(api.cancel).not.toHaveBeenCalled();
  });
});
