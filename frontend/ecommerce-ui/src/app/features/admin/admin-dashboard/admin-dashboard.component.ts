import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, HasRoleDirective],
  template: `
    <h2 class="mb-4">Admin Dashboard</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card text-center p-4 shadow-sm">
          <h1 class="display-4 text-primary">📦</h1>
          <h5>Manage Products</h5>
          <a routerLink="/admin/products" class="btn btn-primary mt-2">Go</a>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center p-4 shadow-sm">
          <h1 class="display-4 text-success">🛒</h1>
          <h5>Manage Orders</h5>
          <a routerLink="/admin/orders" class="btn btn-success mt-2">Go</a>
        </div>
      </div>
    </div>

    @defer (on viewport; prefetch on idle) {
      <div class="card mt-4 p-4">
        <h5>Analytics (Deferred)</h5>
        <div class="bg-light p-4 text-center text-muted">
          Chart component would render here (deferred for performance)
        </div>
      </div>
    } @placeholder {
      <div class="card mt-4 p-4 text-muted text-center">Loading analytics...</div>
    }
  `
})
export class AdminDashboardComponent {}
