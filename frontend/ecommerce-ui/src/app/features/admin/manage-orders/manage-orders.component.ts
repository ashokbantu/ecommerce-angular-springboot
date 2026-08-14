import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { OrderStatusBadgePipe } from '../../../shared/pipes/order-status.pipe';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [OrderStatusBadgePipe, CurrencyFormatPipe, DatePipe],
  template: `
    <h3 class="mb-4">Manage Orders</h3>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          @for (order of orders(); track order.id) {
            <tr>
              <td>#{{ order.id }}</td>
              <td>{{ order.createdAt | date }}</td>
              <td>{{ order.totalAmount | currencyFormat }}</td>
              <td><span class="badge {{ order.status | orderStatusBadge }}">{{ order.status }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ManageOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<Order[]>([]);

  ngOnInit() {
    this.orderService.getOrders().subscribe((orders) => this.orders.set(orders));
  }
}
