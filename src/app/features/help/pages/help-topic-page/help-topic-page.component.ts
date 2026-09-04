import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '@core/services/seo.service';
import { HelpLayoutComponent } from '../../components/help-layout/help-layout.component';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '@shared/components/breadcrumb/breadcrumb.component';
import { ResolutionBlockComponent } from '../../components/resolution-block/resolution-block.component';
import { isValidHelpTopic } from '../../help.content';

@Component({
  selector: 'app-help-topic-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    HelpLayoutComponent,
    BreadcrumbComponent,
    ResolutionBlockComponent,
  ],
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
      <app-help-layout [title]="title">
        <div class="help-article">
          <p class="help-article-intro">{{ intro }}</p>

          <ol class="help-steps">
            @for (step of steps; track $index) {
              <li>
                <span class="help-step-num">{{ $index + 1 }}</span>
                <span>{{ step }}</span>
              </li>
            }
          </ol>

          <div class="help-note">{{ note }}</div>
          <p class="help-related">{{ related }}</p>

          <div class="help-contact-cta">
            <p>{{ 'help.resolution.contact_hint' | translate }}</p>
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap">
              <a
                [routerLink]="['/contact']"
                [queryParams]="
                  orderId
                    ? { category: categoryId, topic: topicId, orderId: orderId }
                    : { category: categoryId, topic: topicId }
                "
                class="help-pill"
                >{{ 'help.actions.contact' | translate }}</a
              >
              @if (categoryId === 'orders') {
                <a routerLink="/orders" class="help-pill help-pill-secondary">{{
                  'help.actions.view_orders' | translate
                }}</a>
              }
            </div>
          </div>

          <app-resolution-block
            [category]="categoryId"
            [topic]="topicId"
            [orderId]="orderId"
          ></app-resolution-block>

          <div
            style="margin-top:20px; text-align:center; display:flex; gap:12px; justify-content:center; flex-wrap:wrap"
          >
            <a [routerLink]="['/help', categoryId]" class="help-pill help-pill-secondary">{{
              'help.actions.back_to_category' | translate: { category: categoryName }
            }}</a>
            <a routerLink="/help" class="help-pill help-pill-secondary">{{
              'help.actions.back_to_help' | translate
            }}</a>
          </div>
        </div>
      </app-help-layout>
    }
  `,
})
export class HelpTopicPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);

  protected categoryId = '';
  protected topicId = '';
  protected orderId?: string;
  protected categoryName = '';
  protected title = '';
  protected intro = '';
  protected steps: string[] = [];
  protected note = '';
  protected related = '';
  protected breadcrumbItems: BreadcrumbItem[] = [];
  protected isNotFound = false;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((q) => {
      this.orderId = q.get('orderId') ?? undefined;
    });
    this.route.paramMap.subscribe((params) => {
      const cat = params.get('category') ?? '';
      const topic = params.get('topic') ?? '';
      this.categoryId = cat;
      this.topicId = topic;
      // also sync orderId from snapshot in case queryParam arrives before param
      this.orderId = this.route.snapshot.queryParamMap.get('orderId') ?? this.orderId;

      if (!isValidHelpTopic(cat, topic)) {
        this.isNotFound = true;
        this.seo.applySeo({
          title: 'Not found',
          description: 'Not found',
          canonicalPath: `/help/${cat}/${topic}`,
          robots: 'noindex, nofollow',
        });
        this.updateBreadcrumb();
        return;
      }

      this.isNotFound = false;
      this.loadContent();
      this.applySeo();
      this.updateBreadcrumb();
    });

    this.translate.onLangChange.subscribe(() => {
      if (!this.isNotFound) {
        this.loadContent();
        this.applySeo();
        this.updateBreadcrumb();
      }
    });
  }

  private loadContent(): void {
    this.categoryName = this.translate.instant(`help.categories.${this.categoryId}`);
    this.title = this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.title`);
    this.intro = this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.intro`);
    const rawSteps = this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.steps`);
    this.steps = Array.isArray(rawSteps) ? rawSteps : [];
    this.note = this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.note`);
    this.related = this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.related`);
  }

  private applySeo(): void {
    const seo = this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.seo`) as
      { title?: string; description?: string } | string;
    // In messages, seo is object with title/description; handle both raw and instant
    const title =
      typeof seo === 'object' && seo?.title
        ? seo.title
        : this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.seo.title`);
    const description =
      typeof seo === 'object' && seo?.description
        ? seo.description
        : this.translate.instant(`help.topics.${this.categoryId}.${this.topicId}.seo.description`);
    this.seo.applySeo({
      title: title || this.title,
      description: description || this.intro,
      canonicalPath: `/help/${this.categoryId}/${this.topicId}`,
    });
  }

  private updateBreadcrumb(): void {
    if (this.isNotFound) {
      this.breadcrumbItems = [
        { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
        { label: this.translate.instant('help.breadcrumb.help_center'), url: '/help' },
        { label: this.categoryId },
        { label: this.topicId },
      ];
    } else {
      this.breadcrumbItems = [
        { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
        { label: this.translate.instant('help.breadcrumb.help_center'), url: '/help' },
        { label: this.categoryName, url: `/help/${this.categoryId}` },
        { label: this.title },
      ];
    }
  }
}
