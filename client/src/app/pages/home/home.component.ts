import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppServices } from './../../@core/services/AppServices.service';
import { Product } from 'src/app/@core/models/product.model';
import { forkJoin } from 'rxjs';
import { ProductCategory } from 'src/app/@core/enums/products/product.enum';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newProducts: Product[] = [];
  bestSellers: Product[] = [];
  categories: any[] = [];

  laptopProducts: Product[] = [];
  computerProducts: Product[] = [];
  phoneProducts: Product[] = [];

  isLoading: boolean = false;
  categoryLs = EnumService.ParseEnumToArray(ProductCategory)

  constructor(private appServices: AppServices, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    const allProducts$ = this.appServices.ProductService.getAllProducts({});
    const newProducts$ = this.appServices.ProductService.getAllProducts({ sort: 'newest' });
    const bestSellers$ = this.appServices.ProductService.getAllProducts({ sort: 'best-seller' });
    const laptop$ = this.appServices.ProductService.getAllProducts({ category: ProductCategory.Laptop.toLocaleLowerCase() });
    const computer$ = this.appServices.ProductService.getAllProducts({ category: ProductCategory.Computer.toLocaleLowerCase() });
    const phone$ = this.appServices.ProductService.getAllProducts({ category: ProductCategory.Phone.toLocaleLowerCase() });

    forkJoin({
      all: allProducts$,
      newP: newProducts$,
      best: bestSellers$,
      laptop: laptop$,
      computer: computer$,
      phone: phone$
    }).subscribe({
      next: res => {
        // Danh mục chính
        this.categories = [...new Set(res.all.data?.products.map((p: any) => p.product_category))];

        // Sản phẩm mới
        this.newProducts = res.newP.data?.products.slice(0, 8) || [];

        // Sản phẩm bán chạy
        this.bestSellers = res.best.data?.products.slice(0, 8) || [];

        // 3 section danh mục
        this.laptopProducts = res.laptop.data?.products.slice(0, 6) || [];
        this.computerProducts = res.computer.data?.products.slice(0, 6) || [];
        this.phoneProducts = res.phone.data?.products.slice(0, 6) || [];
      },
      error: e => {
        console.error('Load home data error', e);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getProductsByCategory(cat: string) {
    switch (cat) {
      case ProductCategory.Laptop: return this.laptopProducts;
      case ProductCategory.Computer: return this.computerProducts;
      case ProductCategory.Phone: return this.phoneProducts;
      default: return [];
    }
  }

  formatPrice(v: number) {
    return v?.toLocaleString('vi-VN') + ' ₫';
  }

  goToCategory(category: string) {
    // Chuyển tới trang catalog/products và truyền query param
    this.router.navigate(['/catalog/products'], { queryParams: { category } });
  }

  goToTop(sort: string) {
    // Chuyển tới trang catalog/products và truyền query param
    this.router.navigate(['/catalog/products'], { queryParams: { sort } });
  }

  goToDetail(productId: any) {
    // Chuyển tới trang catalog/products và truyền query param
    this.router.navigate(['/products/detail'], { queryParams: { productId } });
  }

  onImgError(event: any) {
    const defaultImg = 'assets/images/default-product.png';
    if (event.target.src !== defaultImg) {
      event.target.src = defaultImg;
    }
  }
}
