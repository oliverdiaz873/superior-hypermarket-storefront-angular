import { Component, Input, OnInit, OnDestroy, inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-help-layout',
  standalone: true,
  templateUrl: './help-layout.component.html',
  styleUrl: './help-layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HelpLayoutComponent implements OnInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('dark-theme-body');
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('dark-theme-body');
    }
  }
}
