import { Subscription } from 'rxjs';
import { SortAction } from './../../../@core/enums/sort.enum';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { Component } from '@angular/core';
import { filterProduct, Product } from 'src/app/@core/models/product.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductBrand, ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
import { AddProductComponent } from './add-product/add-product.component';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { Paging } from 'src/app/@core/models/paging.model';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';

@Component({
  selector: 'app-products',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent {
  products: Product[] = [];
  _statusServiceTag = StatusServiceTag;
  _currencyHelper: any;
  isLoading: boolean = false;
  _paging: Paging = new Paging();
  filter: filterProduct = {};

  selectedCategory: any = '';
  selectedBrand: any = '';
  selectedStatus: any = '';
  selectedSort: any = '';
  searchName: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;

  categoryList = EnumService.ParseEnumToArray(ProductCategory);
  statusList = EnumService.ParseEnumToArray(ProductStatus);
  brandList = EnumService.ParseEnumToArray(ProductBrand);
  SortActionLs = EnumService.ParseEnumToArray(SortAction);

  params: any = null;

  constructor(private _appService: AppServices) { }

  ngOnInit() {
    this._paging.setPaging(1, 10, 0);
    this.params = this._paging.getPagingParams();
    this._currencyHelper = new CurrencyHelper();
    this.loadProducts();
  }

  onFilterChange() {
    this.filter = {
      category: this.selectedCategory.toLowerCase(),
      brand: this.selectedBrand,
      sort: this.selectedSort,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      q: this.searchName || undefined,
      // status: this.selectedStatus.toLowerCase()
    }

    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.params = {
      ...this.filter,
      ...this._paging.getPagingParams()
    }
    this._appService.ProductService.getAllProducts(this.params).subscribe({
      next: (res) => {
        this._paging.setPaging(res.data?.pagination?.pageIndex, res.data?.pagination?.pageSize, res.data?.pagination?.totalItems)
        this.products = res.data?.products || [];
      },
      error: (e) => {
        console.error('Error fetching products:', e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  openAddModalProduct() {
    this._appService.ModalService.createModal('Thêm sản phẩm mới', AddProductComponent, {});
  }

  openEditModalProduct(product: any) {
    const ref = this._appService.ModalService.createModal(
      'Chỉnh sửa thông tin sản phẩm',
      EditProductComponent,
      { product }
    );

    ref.onClose.subscribe((result) => {
      console.log(this.isLoading)
      if (result) {
        this.loadProducts(); // load lại bảng
      }
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
}
