/**
 * ContactFormComponent
 *
 * Handles the contact form UI, validation, and submission flow.
 * Uses Reactive Forms with custom validators matching the original Next.js implementation.
 * Submits the message to the real backend (POST /api/contact) and emits `onSuccess`
 * only when the message is persisted (HTTP 201).
 *
 * Dependencies:
 *  - ContactFormService for validation rules and error translation
 *  - ApiService (core/api) for the real POST /api/contact
 *  - TranslateService (@ngx-translate/core) for i18n error messages
 *  - ToastService for success notifications (handled by parent via onSuccess)
 *
 * Form fields:
 *  - nombre: required, alphabetic (2-50 chars)
 *  - email: required, RFC-compliant regex, max 254 chars
 *  - telefono: optional, 8-15 digits (strips spaces, dashes, parentheses)
 *  - mensaje: required, 10-500 chars
 */
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { ApiService } from '@core/api/api.service';
import { ContactFormService } from '../../services/contact-form.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, NgClass],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly validation = inject(ContactFormService);
  private readonly api = inject(ApiService);

  @Input() initialName?: string;
  @Input() initialEmail?: string;

  readonly success = output<void>();

  isSubmitting = false;
  submitError = '';

  ngOnInit(): void {
    this.applyInitialValues();
  }

  ngOnChanges(): void {
    this.applyInitialValues();
  }

  private applyInitialValues(): void {
    if (this.initialName && !this.form.get('nombre')?.value && !this.form.get('nombre')?.dirty) {
      this.form.get('nombre')?.setValue(this.initialName);
    }
    if (this.initialEmail && !this.form.get('email')?.value && !this.form.get('email')?.dirty) {
      this.form.get('email')?.setValue(this.initialEmail);
    }
  }

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [this.validation.trimmedRequired(), Validators.minLength(2), Validators.maxLength(50), this.validation.alphabeticValidator]],
    email: ['', [this.validation.trimmedRequired(), this.validation.emailValidator]],
    mensaje: ['', [this.validation.trimmedRequired(), Validators.minLength(10), Validators.maxLength(500)]],
    telefono: ['', [this.validation.phoneValidator]]
  });

  getFieldError(field: string): string {
    return this.validation.getFieldError(this.form, field, this.isSubmitting, this.translate);
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { nombre, email, telefono, mensaje } = this.form.getRawValue();

    this.submitError = '';
    this.isSubmitting = true;

    this.api.sendContactMessage({
      name: nombre.trim(),
      email: email.trim(),
      phone: telefono?.trim() || undefined,
      message: mensaje.trim()
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset({
          nombre: '',
          email: '',
          telefono: '',
          mensaje: ''
        });
        this.success.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.submitError = this.resolveSubmitError(error);
      }
    });
  }

  private resolveSubmitError(error: HttpErrorResponse): string {
    if (error.status === 429) {
      return this.translate.instant('contact.form.error.rate_limited');
    }
    const backendMessage = error.error?.message;
    if (typeof backendMessage === 'string' && backendMessage.length > 0) {
      return backendMessage;
    }
    return this.translate.instant('contact.form.error.submit_failed');
  }
}
