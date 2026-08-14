import { Routes } from '@angular/router';

export const SELLER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./seller-dashboard/seller-dashboard.component').then((m) => m.SellerDashboardComponent)
  }
];
