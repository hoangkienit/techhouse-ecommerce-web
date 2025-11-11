import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

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
}
