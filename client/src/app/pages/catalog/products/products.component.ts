import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  product_id: number;
  product_name: string;
  product_brand: string;
  product_price: number;
  product_description: string;
  product_imgs: string[];
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  brandList = [
    { label: 'Apple' },
    { label: 'Samsung' },
    { label: 'Xiaomi' },
    { label: 'Oppo' },
  ];

  categoryList = [
    { label: 'Laptop' },
    { label: 'Smartphone' },
    { label: 'Tablet' },
  ];

  products: Product[] = [
    {
      product_id: 1,
      product_name: 'Laptop Pro 15',
      product_brand: 'Apple',
      product_price: 32000000,
      product_description: 'High performance laptop for work and entertainment.',
      product_imgs: ['https://via.placeholder.com/300x200'],
    },
    {
      product_id: 2,
      product_name: 'Smartphone X',
      product_brand: 'Samsung',
      product_price: 21000000,
      product_description: 'Great screen, sharp camera, long-lasting battery.',
      product_imgs: ['https://via.placeholder.com/300x200'],
    },
  ];

  searchKeyword = '';
  selectedBrand = '';
  selectedCategory = '';
  selectedSort = '';
  minPrice = 0;
  maxPrice = 50000000;
  viewMode: 'grid' | 'list' = 'grid';
  isLoading = false;

  _paging = {
    pageIndex: 1,
    pageSize: 10,
    totalItems: 2,
  };

  constructor(private router: Router) {}

  formatPrice(value: number): string {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  onFilterChange(): void {
    // Placeholder for real filter logic when wired to API
  }

  resetFilter(): void {
    this.searchKeyword = '';
    this.selectedBrand = '';
    this.selectedCategory = '';
    this.selectedSort = '';
    this.minPrice = 0;
    this.maxPrice = 50000000;
    this.onFilterChange();
  }

  onPageChange(event: number | { pageIndex: number; pageSize?: number }): void {
    if (typeof event === 'number') {
      this._paging.pageIndex = event;
      return;
    }
    this._paging.pageIndex = event.pageIndex;
    if (event.pageSize) {
      this._paging.pageSize = event.pageSize;
    }
  }

  goToDetail(productId: number): void {
    this.router.navigate(['/catalog/products', productId]);
  }
}
