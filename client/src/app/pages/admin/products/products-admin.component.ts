import { Component } from '@angular/core';
import { Product } from 'src/app/@core/models/product.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { ViewProductComponent } from './view-product/view-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
import { AddProductComponent } from './add-product/add-product.component';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { Paging } from 'src/app/@core/models/paging.model';

@Component({
  selector: 'app-products',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent {
  products: Product[] = [];
  _statusServiceTag = StatusServiceTag;
  isLoading: boolean = false;
  _paging: Paging = new Paging();

  constructor(private _appService: AppServices) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadProducts();
  }

  loadProducts() {
    this._appService.ProductService.getAllProducts().subscribe({
      next: (res) => {
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
}
