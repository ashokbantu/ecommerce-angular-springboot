import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartStore } from '../../core/store/cart.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">🛒 EcommerceApp</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/catalog" routerLinkActive="active">Catalog</a>
            </li>

            @if (isAuthenticated()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                  Cart
                  @if (cartCount() > 0) {
                    <span class="badge bg-danger ms-1">{{ cartCount() }}</span>
                  }
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/orders" routerLinkActive="active">Orders</a>
              </li>
            }

            @if (isSeller()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/seller" routerLinkActive="active">Seller Dashboard</a>
              </li>
            }

            @if (isAdmin()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin Dashboard</a>
              </li>
            }
          </ul>

          <ul class="navbar-nav">
            @if (isAuthenticated()) {
              <li class="nav-item">
                <span class="nav-link text-muted">{{ currentUser()?.username }}</span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light btn-sm" (click)="logout()">Logout</button>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login" routerLinkActive="active">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/register" routerLinkActive="active">Register</a>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private cartStore = inject(CartStore);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;
  readonly isSeller = this.authService.isSeller;
  readonly currentUser = this.authService.currentUser;
  readonly cartCount = this.cartStore.itemCount;

  logout() {
    this.authService.logout();
  }
}
