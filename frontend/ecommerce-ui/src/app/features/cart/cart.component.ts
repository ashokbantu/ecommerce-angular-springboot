import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../core/store/cart.store';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyFormatPipe],
  template: `
    <h2 class="mb-4">Shopping Cart</h2>
    @if (cartStore.isEmpty()) {
      <div class="text-center py-5">
        <p class="text-muted fs-5">Your cart is empty</p>
        <a routerLink="/catalog" class="btn btn-primary">Browse Products</a>
      </div>
    } @else {
      <div class="row">
        <div class="col-md-8">
          @for (item of cartStore.items(); track item.productId) {
            <div class="card mb-3">
              <div class="card-body d-flex align-items-center gap-3">
                <img [src]="item.imageUrl || 'https://via.placeholder.com/80'" style="width:80px;height:80px;object-fit:cover" class="rounded" alt="{{ item.productName }}">
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ item.productName }}</h6>
                  <p class="text-muted mb-0">{{ item.price | currencyFormat }} each</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn btn-sm btn-outline-secondary" (click)="cartStore.updateQuantity(item.productId, item.quantity - 1)">-</button>
                  <span class="px-2">{{ item.quantity }}</span>
                  <button class="btn btn-sm btn-outline-secondary" (click)="cartStore.updateQuantity(item.productId, item.quantity + 1)">+</button>
                </div>
                <strong>{{ item.price * item.quantity | currencyFormat }}</strong>
                <button class="btn btn-sm btn-danger" (click)="cartStore.removeItem(item.productId)">Remove</button>
              </div>
            </div>
          }
        </div>
        <div class="col-md-4">
          <div class="card shadow">
            <div class="card-body">
              <h5>Order Summary</h5>
              <hr>
              <div class="d-flex justify-content-between">
                <span>Items ({{ cartStore.itemCount() }})</span>
                <span>{{ cartStore.subtotal() | currencyFormat }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span class="text-success">{{ cartStore.subtotal() | currencyFormat }}</span>
              </div>
              <a routerLink="/checkout" class="btn btn-success w-100 mt-3">Proceed to Checkout</a>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class CartComponent implements OnInit {
  cartStore = inject(CartStore);

  ngOnInit() {
    this.cartStore.loadCart();
  }
}
