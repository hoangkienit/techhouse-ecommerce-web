import { AppServices } from './../../@core/services/AppServices.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/@core/models/product.model';
import { ProductStatus, ProductCategory } from 'src/app/@core/enums/products/product.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newProducts: Product[] = [];
  bestSellers: Product[] = [];
  categories: string[] = [];

  laptopProducts: Product[] = [];
  monitorProducts: Product[] = [];
  storageProducts: Product[] = [];

  isLoading: boolean = false;

  constructor(private AppServices: AppServices) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadData();
  }

  loadData() {
  //   // Lấy sản phẩm mới
  //   // this.AppServices.ProductService.getNewProducts().subscribe(products => {
  //   //   this.newProducts = products;
  //   // });

  //   // // Lấy sản phẩm bán chạy
  //   // this.AppServices.ProductService.getBestSellers().subscribe(products => {
  //   //   this.bestSellers = products;
  //   // });

  //   // // Lấy danh mục chính
  //   // this.AppServices.ProductService.getMainCategories().subscribe(cats => {
  //   //   this.categories = cats;
  //   // });
    
  //   // Lấy 3 section danh mục
  //   this.getCategoryProducts('laptop', 'laptopProducts');
  //   this.getCategoryProducts('man-hinh', 'monitorProducts');
  //   this.getCategoryProducts('o-cung', 'storageProducts');

  //   this.isLoading = false;
  }


  getCategoryProducts(
    slug: string,
    target: 'laptopProducts' | 'monitorProducts' | 'storageProducts'
  ) {
    this.AppServices.ProductService.getProductsByCategory(slug).subscribe(products => {
      this[target] = products;
    });
  }

  formatPrice(v: number) {
    return v.toLocaleString('vi-VN') + ' ₫';
  }
}
