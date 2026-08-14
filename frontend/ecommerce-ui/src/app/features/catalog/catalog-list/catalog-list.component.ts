import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartStore } from '../../../core/store/cart.store';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyFormatPipe],
  template: `
    <div class="row mb-4">
      <div class="col-md-6">
        <input type="text" class="form-control" placeholder="Search products..." [(ngModel)]="searchTerm" (ngModelChange)="onSearch()">
      </div>
      <div class="col-md-3">
        <select class="form-select" [(ngModel)]="selectedCategory" (ngModelChange)="onSearch()">
          <option [ngValue]="0">All Categories</option>
          @for (cat of categories(); track cat.id) {
            <option [ngValue]="cat.id">{{ cat.name }}</option>
          }
        </select>
      </div>
    </div>

    @if (isLoading()) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
    } @else {
      <div class="row g-4">
        @for (product of products(); track product.id) {
          <div class="col-md-3">
            <div class="card h-100 shadow-sm">
              <img [src]="product.imageUrl || 'https://via.placeholder.com/300x200'" class="card-img-top" style="height:200px;object-fit:cover" alt="{{ product.name }}">
              <div class="card-body d-flex flex-column">
                <h6 class="card-title">{{ product.name }}</h6>
                <p class="card-text text-muted small flex-grow-1">{{ truncateDescription(product.description) }}</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <strong class="text-success">{{ product.price | currencyFormat }}</strong>
                  <span class="badge bg-secondary">{{ product.categoryName }}</span>
                </div>
                <div class="d-flex gap-2 mt-3">
                  <a [routerLink]="['/catalog', product.id]" class="btn btn-outline-primary btn-sm flex-fill">View</a>
                  <button class="btn btn-primary btn-sm flex-fill" (click)="addToCart(product)">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center py-5">
            <p class="text-muted">No products found.</p>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <nav class="mt-4">
          <ul class="pagination justify-content-center">
            @for (page of pageArray(); track page) {
              <li class="page-item" [class.active]="currentPage() === page">
                <button class="page-link" (click)="goToPage(page)">{{ page + 1 }}</button>
              </li>
            }
          </ul>
        </nav>
      }
    }

    @defer (on viewport) {
      <div class="visually-hidden">Deferred analytics placeholder</div>
    } @placeholder {
      <div class="visually-hidden">Preparing deferred content...</div>
    }
  `
})
export class CatalogListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartStore = inject(CartStore);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  searchTerm = '';
  selectedCategory = 0;

  pageArray = () => Array.from({ length: this.totalPages() }, (_, index) => index);

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe((categories) => this.categories.set(categories));
  }

  loadProducts() {
    this.isLoading.set(true);
    const categoryId = this.selectedCategory || undefined;
    const search = this.searchTerm || undefined;
    this.productService.getProducts(this.currentPage(), 12, search, categoryId).subscribe({
      next: (page) => {
        this.products.set(page.content);
        this.totalPages.set(page.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartStore.addItem(product.id, 1);
  }

  truncateDescription(description: string): string {
    if (!description) {
      return '';
    }
    return description.length > 80 ? `${description.substring(0, 80)}...` : description;
  }
}
