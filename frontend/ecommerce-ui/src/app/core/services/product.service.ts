import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category, Product, ProductPage } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getProducts(page = 0, size = 12, search?: string, categoryId?: number) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) {
      params = params.set('search', search);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    return this.http.get<ProductPage>(this.baseUrl, { params });
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/products/categories`);
  }

  createProduct(product: Partial<Product>) {
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>) {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
