import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-demo-request-modal',
    templateUrl: './demo-request-modal.component.html',
    styleUrls: ['./demo-request-modal.component.scss'],
    standalone: false
})
export class DemoRequestModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  demoForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.demoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.demoForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.requestDemo(this.demoForm.value.email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to submit demo request. Please try again.';
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
