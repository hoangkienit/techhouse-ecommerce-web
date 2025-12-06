import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Brand {
  id: number;
  label: string;
}

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent {
  brands: Brand[] = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Samsung' },
    { id: 3, label: 'Xiaomi' },
    { id: 4, label: 'Oppo' },
  ];

  selectedBrand = '';

  _paging = {
    pageIndex: 1,
    pageSize: 10,
    totalItems: 4,
  };

  constructor(private router: Router) {}

  onFilterChange(): void {
    // Placeholder for filter logic when API is connected
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

  goToBrandDetail(brandId: number): void {
    this.router.navigate(['/catalog/brands', brandId]);
  }
}
