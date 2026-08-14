import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyFormatPipe],
  template: `
    <h2 class="mb-4">Seller Dashboard</h2>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>My Products</h5>
      <button class="btn btn-primary btn-sm">+ Add Product</button>
    </div>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (product of products(); track product.id) {
            <tr>
              <td>{{ product.name }}</td>
              <td>{{ product.price | currencyFormat }}</td>
              <td>{{ product.stockQuantity }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary">Edit</button>
                <button class="btn btn-sm btn-outline-danger ms-2">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class SellerDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);

  ngOnInit() {
    this.productService.getProducts(0, 100).subscribe((page) => this.products.set(page.content));
  }
}
