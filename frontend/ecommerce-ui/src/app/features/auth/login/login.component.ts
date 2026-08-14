import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center py-5">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">Login</h3>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" [class.is-invalid]="isInvalid('username')" formControlName="username" placeholder="Enter username">
                @if (isInvalid('username')) {
                  <div class="invalid-feedback">Username is required</div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" [class.is-invalid]="isInvalid('password')" formControlName="password" placeholder="Enter password">
                @if (isInvalid('password')) {
                  <div class="invalid-feedback">Password is required (min 6 chars)</div>
                }
              </div>

              @if (errorMessage()) {
                <div class="alert alert-danger">{{ errorMessage() }}</div>
              }

              <button type="submit" class="btn btn-primary w-100" [disabled]="isLoading() || loginForm.invalid">
                @if (isLoading()) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                }
                Login
              </button>
            </form>

            <p class="text-center mt-3">
              Don't have an account? <a routerLink="/auth/register">Register</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  isLoading = this.authService.isLoading;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/catalog']),
      error: (err) => this.errorMessage.set(err.error?.message || 'Login failed')
    });
  }
}
