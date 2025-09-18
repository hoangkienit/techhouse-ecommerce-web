import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [
    { id: 'p1', name: 'Áo phông Cotton', price: 199000, image: 'assets/img/p1.jpg', category: 'Thời trang', isNew: true, sold: 120 },
    { id: 'p2', name: 'Tai nghe Bluetooth', price: 499000, image: 'assets/img/p2.jpg', category: 'Audio', isNew: false, sold: 420 },
    { id: 'p3', name: 'Giày chạy bộ', price: 899000, image: 'assets/img/p3.jpg', category: 'Thể thao', isNew: true, sold: 250 },
    { id: 'p4', name: 'Cặp laptop', price: 349000, image: 'assets/img/p4.jpg', category: 'Phụ kiện', isNew: false, sold: 85 },
    { id: 'p5', name: 'Đồng hồ thông minh', price: 1299000, image: 'assets/img/p5.jpg', category: 'Wearable', isNew: true, sold: 380 },
    // thêm dữ liệu...
  ];

  getAll(): Observable<Product[]> {
    return of(this.products);
  }

  getNewProducts(limit = 6): Observable<Product[]> {
    return of(this.products.filter(p => p.isNew).slice(0, limit));
  }

  getBestSellers(limit = 6): Observable<Product[]> {
    return of(this.products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, limit));
  }

  getMainCategories(): Observable<string[]> {
    const cats = Array.from(new Set(this.products.map(p => p.category)));
    return of(cats);
  }
}
