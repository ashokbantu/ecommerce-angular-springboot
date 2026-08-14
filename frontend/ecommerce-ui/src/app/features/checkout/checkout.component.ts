import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { CartStore } from '../../core/store/cart.store';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyFormatPipe],
  template: `
    <h2 class="mb-4">Checkout</h2>

    <div class="d-flex gap-3 mb-4 flex-wrap">
      @for (step of steps; track step.num) {
        <div class="d-flex align-items-center gap-2">
          <span class="badge rounded-pill" [class.bg-primary]="currentStep() >= step.num" [class.bg-secondary]="currentStep() < step.num">{{ step.num }}</span>
          <span [class.fw-bold]="currentStep() === step.num">{{ step.label }}</span>
        </div>
      }
    </div>

    @switch (currentStep()) {
      @case (1) {
        <div class="card p-4">
          <h5>Shipping Information</h5>
          <form [formGroup]="shippingForm">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" formControlName="fullName">
            </div>
            <div class="mb-3">
              <label class="form-label">Address</label>
              <textarea class="form-control" formControlName="address" rows="3"></textarea>
            </div>
            <div class="row">
              <div class="col">
                <label class="form-label">City</label>
                <input type="text" class="form-control" formControlName="city">
              </div>
              <div class="col">
                <label class="form-label">ZIP</label>
                <input type="text" class="form-control" formControlName="zip">
              </div>
            </div>
          </form>
          <button class="btn btn-primary mt-3" (click)="nextStep()" [disabled]="shippingForm.invalid">Next</button>
        </div>
      }
      @case (2) {
        <div class="card p-4">
          <h5>Payment (Mock)</h5>
          <div class="alert alert-info">This is a mock payment step. No real payment is processed.</div>
          <div class="mb-3">
            <label class="form-label">Card Number</label>
            <input type="text" class="form-control" placeholder="4242 4242 4242 4242" readonly>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary" (click)="prevStep()">Back</button>
            <button class="btn btn-primary" (click)="nextStep()">Next</button>
          </div>
        </div>
      }
      @case (3) {
        <div class="card p-4">
          <h5>Review Order</h5>
          <p><strong>Ship to:</strong> {{ shippingForm.value.address }}, {{ shippingForm.value.city }} {{ shippingForm.value.zip }}</p>
          <p><strong>Items:</strong> {{ cartStore.itemCount() }}</p>
          <p><strong>Total:</strong> {{ cartStore.subtotal() | currencyFormat }}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary" (click)="prevStep()">Back</button>
            <button class="btn btn-success" (click)="placeOrder()" [disabled]="isLoading()">
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Place Order
            </button>
          </div>
        </div>
      }
    }
  `
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private router = inject(Router);
  cartStore = inject(CartStore);

  currentStep = signal(1);
  isLoading = signal(false);
  steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' }
  ];

  shippingForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required]
  });

  nextStep() {
    this.currentStep.update((step) => step + 1);
  }

  prevStep() {
    this.currentStep.update((step) => step - 1);
  }

  placeOrder() {
    this.isLoading.set(true);
    const value = this.shippingForm.getRawValue();
    const address = `${value.fullName}, ${value.address}, ${value.city} ${value.zip}`;
    this.orderService.createOrder(address, this.cartStore.items()).subscribe({
      next: () => {
        this.cartStore.clearCart();
        this.router.navigate(['/orders']);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
