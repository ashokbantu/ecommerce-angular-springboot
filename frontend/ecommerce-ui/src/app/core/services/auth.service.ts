import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

interface DecodedToken {
  exp: number;
  userId: number;
  sub: string;
  email: string;
  roles?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUser = signal<User | null>(this.loadUserFromStorage());
  private _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.roles.includes('ROLE_ADMIN') ?? false);
  readonly isSeller = computed(() => this._currentUser()?.roles.includes('ROLE_SELLER') ?? false);
  readonly isCustomer = computed(() => this._currentUser()?.roles.includes('ROLE_CUSTOMER') ?? false);
  readonly isLoading = this._isLoading.asReadonly();

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest) {
    this._isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap({
        next: (response) => {
          this.storeTokens(response);
          this._currentUser.set(response.user);
          this._isLoading.set(false);
        },
        error: () => this._isLoading.set(false)
      })
    );
  }

  register(request: RegisterRequest) {
    this._isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
      tap({
        next: (response) => {
          this.storeTokens(response);
          this._currentUser.set(response.user);
          this._isLoading.set(false);
        },
        error: () => this._isLoading.set(false)
      })
    );
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    this.http.post(`${this.baseUrl}/logout`, { refreshToken }).subscribe({ error: () => undefined });
    this.clearTokens();
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.storeTokens(response);
        this._currentUser.set(response.user);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  hasRole(role: string): boolean {
    return this._currentUser()?.roles.includes(role) ?? false;
  }

  private storeTokens(response: AuthResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private loadUserFromStorage(): User | null {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 < Date.now()) {
        this.clearTokens();
        return null;
      }

      return {
        id: decoded.userId,
        username: decoded.sub,
        email: decoded.email,
        roles: decoded.roles ?? []
      };
    } catch {
      this.clearTokens();
      return null;
    }
  }
}
