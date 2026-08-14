import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasMinLength = value.length >= 8;
  if (!hasUpperCase || !hasNumber || !hasMinLength) {
    return { weakPassword: 'Must be 8+ chars with uppercase and number' };
  }
  return null;
}

function confirmPasswordMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center py-5">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">Create Account</h3>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" [class.is-invalid]="isInvalid('username')" formControlName="username">
                @if (isInvalid('username')) {
                  <div class="invalid-feedback">Username required (3+ chars)</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [class.is-invalid]="isInvalid('email')" formControlName="email">
                @if (isInvalid('email')) {
                  <div class="invalid-feedback">Valid email required</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" [class.is-invalid]="isInvalid('password')" formControlName="password">
                @if (isInvalid('password')) {
                  <div class="invalid-feedback">
                    {{ registerForm.get('password')?.errors?.['weakPassword'] || 'Password required' }}
                  </div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input type="password" class="form-control" [class.is-invalid]="isInvalid('confirmPassword') || (registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched)" formControlName="confirmPassword">
                @if (registerForm.errors?.['mismatch'] && registerForm.get('confirmPassword')?.touched) {
                  <div class="text-danger small">Passwords do not match</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Account Type</label>
                <select class="form-select" formControlName="role">
                  <option value="ROLE_CUSTOMER">Customer</option>
                  <option value="ROLE_SELLER">Seller</option>
                </select>
              </div>
              @if (errorMessage()) {
                <div class="alert alert-danger">{{ errorMessage() }}</div>
              }
              <button type="submit" class="btn btn-success w-100" [disabled]="isLoading() || registerForm.invalid">
                @if (isLoading()) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                }
                Register
              </button>
            </form>
            <p class="text-center mt-3">Already have an account? <a routerLink="/auth/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  isLoading = this.authService.isLoading;

  registerForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrength]],
      confirmPassword: ['', Validators.required],
      role: ['ROLE_CUSTOMER']
    },
    { validators: confirmPasswordMatch }
  );

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    const { confirmPassword, ...request } = this.registerForm.getRawValue();
    void confirmPassword;
    this.authService.register(request).subscribe({
      next: () => this.router.navigate(['/catalog']),
      error: (err) => this.errorMessage.set(err.error?.message || 'Registration failed')
    });
  }
}
