import { Component, OnInit } from '@angular/core';
import { Product, filterProduct } from 'src/app/@core/models/product.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';
import { Paging } from 'src/app/@core/models/paging.model';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { ProductBrand, ProductCategory } from 'src/app/@core/enums/products/product.enum';
import { SortAction } from 'src/app/@core/enums/sort.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  filter: filterProduct = {};

  selectedCategory: any = '';
  selectedBrand: any = '';
  selectedSort: any = '';
  searchName: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;

  _currencyHelper: any;
  _paging: Paging = new Paging();

  categoryList = EnumService.ParseEnumToArray(ProductCategory);
  brandList = EnumService.ParseEnumToArray(ProductBrand);
  SortActionLs = EnumService.ParseEnumToArray(SortAction);

  constructor(private _appService: AppServices, private routerActivated: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this._currencyHelper = new CurrencyHelper();
    this._paging.setPaging(1, 50, 0); // 50 sản phẩm/trang

    this.routerActivated.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.onFilterChange();
      }
    });

    this.loadProducts();
  }

  onFilterChange() {
    this._paging.setPageIndex(1); // reset page khi filter
    this.filter = {
      category: this.selectedCategory.toLowerCase() || undefined,
      brand: this.selectedBrand.toLowerCase() || undefined,
      sort: this.selectedSort.toLowerCase() || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      q: this.searchName || undefined,
    };
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    const params = { ...this.filter, ...this._paging.getPagingParams() };
    this._appService.ProductService.getAllProducts(params).subscribe({
      next: res => {
        this.products = res.data?.products || [];
        const pag = res.data?.pagination;
        if (pag) this._paging.setPaging(pag.pageIndex, pag.pageSize, pag.totalItems);
      },
      error: e => { console.error(e); this.isLoading = false; },
      complete: () => this.isLoading = false
    });
  }

  onPageChange(e: { pageIndex: number, pageSize: number }) {
    this._paging.setPageIndex(e.pageIndex);
    this._paging.setPageSize(e.pageSize);
    this.loadProducts();
  }

  onMinInput(event: any) {
    const val = event.target.value;
    this._currencyHelper.setMinValue(val);
    this.minPrice = Number(this._currencyHelper.minValue.replace(/\./g, ''));
  }

  onMaxInput(event: any) {
    const val = event.target.value;
    this._currencyHelper.setMaxValue(val);
    this.maxPrice = Number(this._currencyHelper.maxValue.replace(/\./g, ''));
  }

  formatPrice(v: number) {
    return v?.toLocaleString('vi-VN') + ' ₫';
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
