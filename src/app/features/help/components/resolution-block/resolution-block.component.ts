import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-resolution-block',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="help-resolution">
      <p>{{ 'help.resolution.question' | translate }}</p>
      <div class="help-resolution-actions">
        <button type="button" class="help-pill" (click)="onYes()">
          {{ 'help.resolution.yes' | translate }}
        </button>
        <a
          [routerLink]="['/contact']"
          [queryParams]="orderId ? { category, topic, orderId } : { category, topic }"
          class="help-pill help-pill-secondary"
          >{{ 'help.resolution.no' | translate }}</a
        >
      </div>
      <p style="font-size:13px; color:rgba(255,255,255,0.6); margin-top:10px; font-weight:400">
        {{ 'help.resolution.contact_hint' | translate }}
      </p>
    </div>
  `,
})
export class ResolutionBlockComponent {
  @Input({ required: true }) category!: string;
  @Input({ required: true }) topic!: string;
  @Input() orderId?: string;

  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  protected onYes(): void {
    this.toast.success(this.translate.instant('help.resolution.thanks'));
  }
}
