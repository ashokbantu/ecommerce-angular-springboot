import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartStore } from '../../../core/store/cart.store';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyFormatPipe],
  template: `
    <div class="container py-4">
      <a routerLink="/catalog" class="btn btn-outline-secondary mb-3">← Back to Catalog</a>
      @if (product()) {
        <div class="row g-4">
          <div class="col-md-5">
            <img [src]="product()!.imageUrl || 'https://via.placeholder.com/500'" class="img-fluid rounded shadow" alt="{{ product()!.name }}">
          </div>
          <div class="col-md-7">
            <h2>{{ product()!.name }}</h2>
            <span class="badge bg-secondary mb-3">{{ product()!.categoryName }}</span>
            <p class="text-muted">{{ product()!.description }}</p>
            <h3 class="text-success">{{ product()!.price | currencyFormat }}</h3>
            <p>Stock: <strong>{{ product()!.stockQuantity }}</strong> units</p>
            <div class="d-flex align-items-center gap-3">
              <input type="number" class="form-control" style="width:100px" [(ngModel)]="quantity" min="1">
              <button class="btn btn-primary btn-lg" (click)="addToCart()">Add to Cart</button>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartStore = inject(CartStore);

  product = signal<Product | null>(null);
  quantity = 1;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((product) => this.product.set(product));
  }

  addToCart() {
    const selectedProduct = this.product();
    if (selectedProduct) {
      this.cartStore.addItem(selectedProduct.id, this.quantity);
    }
  }
}
