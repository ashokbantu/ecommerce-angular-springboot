import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartItem, Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private readonly orderUrl = `${environment.apiUrl}/orders`;
  private readonly cartUrl = `${environment.apiUrl}/cart`;

  getOrders() {
    return this.http.get<Order[]>(this.orderUrl);
  }

  getOrder(id: number) {
    return this.http.get<Order>(`${this.orderUrl}/${id}`);
  }

  createOrder(shippingAddress: string, items: CartItem[]) {
    return this.http.post<Order>(this.orderUrl, { shippingAddress, items });
  }

  getCart() {
    return this.http.get<CartItem[]>(this.cartUrl);
  }

  addToCart(item: { productId: number; quantity: number }) {
    return this.http.post<CartItem>(this.cartUrl, item);
  }

  removeFromCart(productId: number) {
    return this.http.delete(`${this.cartUrl}/${productId}`);
  }

  updateCartItem(productId: number, quantity: number) {
    return this.http.put<CartItem>(`${this.cartUrl}/${productId}`, { quantity });
  }
}
