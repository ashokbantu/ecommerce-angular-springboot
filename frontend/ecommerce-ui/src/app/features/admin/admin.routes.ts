import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./manage-products/manage-products.component').then((m) => m.ManageProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./manage-orders/manage-orders.component').then((m) => m.ManageOrdersComponent)
  }
];
