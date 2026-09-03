import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '@core/services/seo.service';
import { AuthService } from '@features/auth/services/auth.service';
import { HelpLayoutComponent } from '../../components/help-layout/help-layout.component';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { HELP_CATEGORIES } from '../../help.content';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [RouterLink, TranslatePipe, HelpLayoutComponent, BreadcrumbComponent],
  template: `
    <div class="help-breadcrumb-wrap">
      <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
    </div>
    <app-help-layout [title]="'help.hero.title' | translate" [subtitle]="'help.hero.subtitle' | translate">
      @if (authService.status() === 'authenticated') {
        <div class="help-contact-banner">
          <a routerLink="/orders">{{ 'help.actions.view_orders' | translate }} →</a>
        </div>
      } @else {
        <div class="help-contact-banner">
          <a routerLink="/login" [queryParams]="{returnUrl: '/help'}">{{ 'help.actions.login' | translate }} {{ ('help.category_descriptions.orders' | translate).toLowerCase() }} →</a>
        </div>
      }

      <div class="help-grid">
        @for (cat of categories; track cat.id) {
          <a [routerLink]="['/help', cat.id]" class="help-card">
            <h3>{{ 'help.categories.' + cat.id | translate }}</h3>
            <p>{{ 'help.category_descriptions.' + cat.id | translate }}</p>
            <span class="help-card-cta">{{ 'help.actions.help' | translate }} →</span>
          </a>
        }
      </div>

      <div class="help-contact-cta">
        <p>{{ 'help.resolution.contact_hint' | translate }}</p>
        <a routerLink="/contact" class="help-pill">{{ 'help.actions.contact' | translate }}</a>
      </div>
    </app-help-layout>
  `,
})
export class HelpPageComponent implements OnInit {
  protected readonly categories = HELP_CATEGORIES;
  protected readonly authService = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  protected breadcrumbItems: BreadcrumbItem[] = [];

  ngOnInit(): void {
    this.seo.applySeo({
      titleKey: 'help.seo.index.title',
      descriptionKey: 'help.seo.index.description',
      canonicalPath: '/help',
    });
    this.updateBreadcrumb();
    this.translate.onLangChange.subscribe(() => this.updateBreadcrumb());
  }

  private updateBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
      { label: this.translate.instant('help.breadcrumb.help_center') },
    ];
  }
}
