import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private orderService = inject(OrderService);

  private _items = signal<CartItem[]>([]);
  private _isLoading = signal(false);

  readonly items = this._items.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly itemCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, item) => sum + item.price * item.quantity, 0));
  readonly isEmpty = computed(() => this._items().length === 0);

  constructor() {
    effect(() => {
      console.log(`Cart updated: ${this.itemCount()} items, total: $${this.subtotal().toFixed(2)}`);
    });
  }

  loadCart() {
    this._isLoading.set(true);
    this.orderService.getCart().subscribe({
      next: (items) => {
        this._items.set(items);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false)
    });
  }

  addItem(productId: number, quantity: number) {
    this.orderService.addToCart({ productId, quantity }).subscribe({
      next: () => this.loadCart()
    });
  }

  removeItem(productId: number) {
    this.orderService.removeFromCart(productId).subscribe({
      next: () => {
        this._items.update((items) => items.filter((item) => item.productId !== productId));
      }
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.orderService.updateCartItem(productId, quantity).subscribe({
      next: () => {
        this._items.update((items) =>
          items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
      }
    });
  }

  clearCart() {
    this._items.set([]);
  }
}
