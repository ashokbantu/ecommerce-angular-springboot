import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { OrderStatusBadgePipe } from '../../../shared/pipes/order-status.pipe';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, OrderStatusBadgePipe, CurrencyFormatPipe, DatePipe],
  template: `
    <h2 class="mb-4">My Orders</h2>
    @if (isLoading()) {
      <div class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    } @else if (orders().length === 0) {
      <p class="text-muted">No orders yet. <a routerLink="/catalog">Start shopping!</a></p>
    } @else {
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-dark">
            <tr>
              <th>Order ID</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders(); track order.id) {
              <tr>
                <td>#{{ order.id }}</td>
                <td>{{ order.createdAt | date }}</td>
                <td>{{ order.totalAmount | currencyFormat }}</td>
                <td><span class="badge {{ order.status | orderStatusBadge }}">{{ order.status }}</span></td>
                <td><a [routerLink]="['/orders', order.id]" class="btn btn-sm btn-outline-primary">View</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.isLoading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
