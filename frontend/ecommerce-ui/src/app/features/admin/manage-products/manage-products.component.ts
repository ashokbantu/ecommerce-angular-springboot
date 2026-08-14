import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CurrencyFormatPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Manage Products</h3>
      <button class="btn btn-primary" (click)="showAddForm.set(!showAddForm())">+ Add Product</button>
    </div>

    @if (showAddForm()) {
      <div class="card p-4 mb-4">
        <h5>Add New Product</h5>
        <p class="text-muted">Product form would go here (abbreviated for brevity)</p>
        <button class="btn btn-secondary" (click)="showAddForm.set(false)">Cancel</button>
      </div>
    }

    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (product of products(); track product.id) {
            <tr>
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.categoryName }}</td>
              <td>{{ product.price | currencyFormat }}</td>
              <td>{{ product.stockQuantity }}</td>
              <td>
                <button class="btn btn-sm btn-outline-danger" (click)="delete(product.id)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ManageProductsComponent implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  showAddForm = signal(false);

  ngOnInit() {
    this.productService.getProducts(0, 100).subscribe((page) => this.products.set(page.content));
  }

  delete(id: number) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products.update((products) => products.filter((product) => product.id !== id));
      });
    }
  }
}
