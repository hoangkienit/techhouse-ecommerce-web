import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  id: number;
  label: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  categories: Category[] = [
    { id: 1, label: 'Laptop' },
    { id: 2, label: 'Smartphone' },
    { id: 3, label: 'Tablet' },
    { id: 4, label: 'Accessories' },
  ];

  selectedCategory = '';

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

  goToCategoryDetail(categoryId: number): void {
    this.router.navigate(['/catalog/categories', categoryId]);
  }
}
