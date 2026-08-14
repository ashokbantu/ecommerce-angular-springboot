import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { OrderStatusBadgePipe } from '../../../shared/pipes/order-status.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, OrderStatusBadgePipe, CurrencyFormatPipe, DatePipe],
  template: `
    <a routerLink="/orders" class="btn btn-outline-secondary mb-3">← Back</a>
    @if (order()) {
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Order #{{ order()!.id }}</h5>
          <span class="badge {{ order()!.status | orderStatusBadge }} fs-6">{{ order()!.status }}</span>
        </div>
        <div class="card-body">
          <p><strong>Date:</strong> {{ order()!.createdAt | date:'medium' }}</p>
          <p><strong>Shipping:</strong> {{ order()!.shippingAddress }}</p>
          <table class="table">
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              @for (item of order()!.items; track item.productId) {
                <tr>
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.price | currencyFormat }}</td>
                  <td>{{ item.price * item.quantity | currencyFormat }}</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr class="fw-bold">
                <td colspan="3" class="text-end">Total</td>
                <td class="text-success">{{ order()!.totalAmount | currencyFormat }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    }
  `
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  order = signal<Order | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrder(id).subscribe((order) => this.order.set(order));
  }
}
