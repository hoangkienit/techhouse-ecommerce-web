import { AppServices } from './../../@core/services/AppServices.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/@core/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newProducts: Product[] = [];
  bestSellers: Product[] = [];
  categories: string[] = [];
  isLoading: boolean = false;

  constructor(private AppServices: AppServices) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadData();
  }

  loadData() {
    this.AppServices.ProductService.getNewProducts().subscribe(products => {
      this.newProducts = products;
      this.isLoading = false;
    });

    this.AppServices.ProductService.getBestSellers().subscribe(products => {
      this.bestSellers = products;
      this.isLoading = false;
    });
    this.AppServices.ProductService.getMainCategories().subscribe(cats => {
      this.categories = cats;
      this.isLoading = false;
    });
  }

  formatPrice(v: number) {
    return v.toLocaleString('vi-VN') + ' ₫';
  }
}
