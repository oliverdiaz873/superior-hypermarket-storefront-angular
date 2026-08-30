import { TestBed } from '@angular/core/testing';
import { AboutUsComponent } from './about-us.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('AboutUsComponent', () => {
  let translateService: Record<string, unknown>;

  beforeEach(async () => {
    const onEvent = { subscribe: vi.fn() };
    translateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      translate: vi.fn((key: string) => () => key),
      currentLang: 'es',
      onTranslationChange: onEvent,
      onLangChange: onEvent,
      onDefaultLangChange: onEvent,
      defaultLang: 'es',
      addLangs: vi.fn(),
      getLangs: vi.fn(() => ['es', 'en']),
      setDefaultLang: vi.fn(),
      use: vi.fn(),
      reloadLang: vi.fn(() => Promise.resolve()),
      resetLang: vi.fn(),
      getBrowserLang: vi.fn(() => 'es'),
      getBrowserCultureLang: vi.fn(() => 'es-ES'),
      setTranslation: vi.fn(),
      getTranslation: vi.fn(() => Promise.resolve({})),
      stream: vi.fn((key: string) => key),
    };

    await TestBed.configureTestingModule({
      imports: [AboutUsComponent],
      providers: [
        { provide: TranslateService, useValue: translateService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AboutUsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the logo image', () => {
    const fixture = TestBed.createComponent(AboutUsComponent);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('should use the correct image path', () => {
    const fixture = TestBed.createComponent(AboutUsComponent);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toContain('logo.png');
  });

  it('should render the title and description containers', () => {
    const fixture = TestBed.createComponent(AboutUsComponent);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('.about-us-section');
    expect(section).toBeTruthy();

    const heading = section.querySelector('h2');
    expect(heading).toBeTruthy();

    const paragraph = section.querySelector('p');
    expect(paragraph).toBeTruthy();
  });

  it('should render the logo sizing classes', () => {
    const fixture = TestBed.createComponent(AboutUsComponent);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img.classList).toContain('w-[220px]');
    expect(img.classList).toContain('md:w-[320px]');
    expect(img.classList).toContain('lg:w-[400px]');
  });
});
