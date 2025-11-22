import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = apiUrl + 'product';
  private credentials = { withCredentials: true };

  constructor(private http: HttpClient) { }

  addProduct(product: Product): Observable<any> {
    console.log('Adding product:', product);
    return this.http.post<{}>(`${this.baseUrl}/add`, product, this.credentials);
  }

  // getAll(): Observable<Product[]> {
  //   return of(this.products);
  // }

  // getNewProducts(limit = 6): Observable<Product[]> {
  //   return of(this.products.filter(p => p.isNew).slice(0, limit));
  // }

  // getBestSellers(limit = 6): Observable<Product[]> {
  //   return of(this.products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, limit));
  // }

  // getMainCategories(): Observable<string[]> {
  //   const cats = Array.from(new Set(this.products.map(p => p.category)));
  //   return of(cats);
  // }

      getProductsByCategory(slug: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.baseUrl}/category/${slug}`);
    }
}
