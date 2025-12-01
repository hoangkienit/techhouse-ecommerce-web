import { SortAction } from './../../../@core/enums/sort.enum';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { Component } from '@angular/core';
import { filterProduct, Product } from 'src/app/@core/models/product.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
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
    this.isLoading = true;
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
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  viewModalProduct() {
    this._appService.ModalService.createModal('Chỉnh sửa sản phẩm', EditProductComponent, {
      product: {
        code: 'SP001',
        name: 'Áo Thun Nam',
        price: 199000,
        status: 'available',
        description: 'Chất liệu cotton, co giãn thoải mái.',
        image: 'https://example.com/image.jpg',
      },
    });
  }

  openAddModalProduct() {
    const sampleProduct = {
      product_name: "MacBook Pro 16 inch",
      product_description: "Laptop mạnh mẽ với chip M1 Pro, màn hình Retina 16 inch.",
      product_slug: "macbook-pro-16",
      product_brand: "Apple",
      product_price: 59990000, // VND
      product_imgs: [
        "https://example.com/images/macbook-front.jpg",
        "https://example.com/images/macbook-back.jpg"
      ],
      product_category: ProductCategory.Laptop,
      product_attributes: {
        cpu: "Apple M1 Pro",
        ram: "16GB",
        storage: "1TB SSD",
        screen: "16 inch Retina",
        color: "Space Gray"
      },
      product_stock: 10,
      product_sold_amount: 0,
      product_status: ProductStatus.Active
    };
    // this._appService.ProductService.addProduct(sampleProduct).subscribe({
    //   next: (response) => {
    //     console.log('Product added successfully:', response);
    //   },
    //   error: (err) => {
    //     console.error('Error adding product:', err);
    //   },
    //   complete: () => {
    //     console.log('Request completed');
    //   }
    // });

    this._appService.ModalService.createModal('Thêm sản phẩm mới', AddProductComponent, {});
  }

  openEditModalProduct(product: any) {
    this._appService.ModalService.createModal('Chỉnh sửa thông tin sản phẩm', EditProductComponent, {
      product
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
