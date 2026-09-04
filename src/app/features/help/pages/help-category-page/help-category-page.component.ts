import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '@core/services/seo.service';
import { HelpLayoutComponent } from '../../components/help-layout/help-layout.component';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '@shared/components/breadcrumb/breadcrumb.component';
import { HELP_CATEGORIES, isValidHelpCategory } from '../../help.content';

@Component({
  selector: 'app-help-category-page',
  standalone: true,
  imports: [RouterLink, TranslatePipe, HelpLayoutComponent, BreadcrumbComponent],
  template: `
    @if (isNotFound) {
      <div class="help-container">
        <h1 class="main-title">{{ 'help.empty' | translate }}</h1>
        <div class="help-contact-cta">
          <a routerLink="/help" class="help-pill">{{ 'help.actions.back_to_help' | translate }}</a>
        </div>
      </div>
    } @else {
      <div class="help-breadcrumb-wrap">
        <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
      </div>
      <app-help-layout [title]="categoryName" [subtitle]="categoryDescription">
        <div class="help-topic-list">
          @for (topic of topics; track topic.id) {
            <a [routerLink]="['/help', categoryId, topic.id]" class="help-topic-item">
              <div>
                <h3>{{ 'help.topics.' + categoryId + '.' + topic.id + '.title' | translate }}</h3>
                <p>{{ 'help.topics.' + categoryId + '.' + topic.id + '.intro' | translate }}</p>
              </div>
              <span class="help-topic-chevron">›</span>
            </a>
          }
        </div>

        <div class="help-contact-cta">
          <p>{{ 'help.resolution.contact_hint' | translate }}</p>
          <a
            [routerLink]="['/contact']"
            [queryParams]="{ category: categoryId }"
            class="help-pill"
            >{{ 'help.actions.contact' | translate }}</a
          >
        </div>

        <div style="margin-top:16px; text-align:center">
          <a routerLink="/help" class="help-pill help-pill-secondary">{{
            'help.actions.back_to_help' | translate
          }}</a>
        </div>
      </app-help-layout>
    }
  `,
})
export class HelpCategoryPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  protected categoryId = '';
  protected categoryName = '';
  protected categoryDescription = '';
  protected topics: { id: string }[] = [];
  protected breadcrumbItems: BreadcrumbItem[] = [];
  protected isNotFound = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const cat = params.get('category') ?? '';
      this.categoryId = cat;
      if (!isValidHelpCategory(cat)) {
        this.isNotFound = true;
        this.seo.applySeo({
          title: 'Not found',
          description: 'Not found',
          canonicalPath: `/help/${cat}`,
          robots: 'noindex, nofollow',
        });
        this.updateBreadcrumb();
        return;
      }
      this.isNotFound = false;
      const catData = HELP_CATEGORIES.find((c) => c.id === cat);
      this.topics = catData ? [...catData.topics] : [];
      this.categoryName = this.translate.instant(`help.categories.${cat}`);
      this.categoryDescription = this.translate.instant(`help.category_descriptions.${cat}`);
      this.applySeo();
      this.updateBreadcrumb();
    });

    this.translate.onLangChange.subscribe(() => {
      if (!this.isNotFound && this.categoryId) {
        this.categoryName = this.translate.instant(`help.categories.${this.categoryId}`);
        this.categoryDescription = this.translate.instant(
          `help.category_descriptions.${this.categoryId}`,
        );
        this.applySeo();
        this.updateBreadcrumb();
      }
    });
  }

  private applySeo(): void {
    const catName = this.translate.instant(`help.categories.${this.categoryId}`);
    this.seo.applySeo({
      title: this.translate.instant('help.seo.category.title_template', { category: catName }),
      description: this.translate.instant('help.seo.category.description_template', {
        category: catName,
      }),
      canonicalPath: `/help/${this.categoryId}`,
    });
  }

  private updateBreadcrumb(): void {
    if (this.isNotFound) {
      this.breadcrumbItems = [
        { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
        { label: this.translate.instant('help.breadcrumb.help_center'), url: '/help' },
        { label: this.categoryId },
      ];
    } else {
      this.breadcrumbItems = [
        { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
        { label: this.translate.instant('help.breadcrumb.help_center'), url: '/help' },
        { label: this.categoryName },
      ];
    }
  }
}
