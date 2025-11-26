import { Component } from '@angular/core';
import { Product } from 'src/app/@core/models/product.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { ViewProductComponent } from './view-product/view-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent {
  products: Product[] = [];

  constructor(private _appService: AppServices) { }

  ngOnInit() {
    this.products = [
      {
        product_name: 'MacBook Pro M3 2024',
        product_description: 'Laptop hiệu năng cao dành cho lập trình viên và designer.',
        product_slug: 'macbook-pro-m3-2024',
        product_brand: 'Apple',
        product_price: 45990000,
        product_imgs: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=940&hei=1112&fmt=png-alpha&.v=1697311079389'],
        product_category: ProductCategory.Laptop,
        product_attributes: {
          cpu: 'Apple M3 Pro',
          ram: '16GB',
          storage: '1TB SSD',
          display: '14 inch Liquid Retina XDR',
        },
        product_stock: 10,
        product_sold_amount: 32,
        product_status: ProductStatus.Active,
      },
      {
        product_name: 'iPhone 15 Pro Max',
        product_description: 'Flagship của Apple với chip A17 Pro, camera 48MP và khung titan.',
        product_slug: 'iphone-15-pro-max',
        product_brand: 'Apple',
        product_price: 34990000,
        product_imgs: ['https://cdn.tgdd.vn/Products/Images/42/304228/iphone-15-pro-max-black-thumbtz-650x650.png'],
        product_category: ProductCategory.Laptop,
        product_attributes: {
          cpu: 'A17 Pro',
          ram: '8GB',
          storage: '256GB',
          display: '6.7 inch Super Retina XDR',
        },
        product_stock: 5,
        product_sold_amount: 120,
        product_status: ProductStatus.Active,
      },
      {
        product_name: 'Samsung Galaxy Tab S9',
        product_description: 'Máy tính bảng Android cao cấp, màn hình AMOLED 120Hz, bút S-Pen.',
        product_slug: 'samsung-galaxy-tab-s9',
        product_brand: 'Samsung',
        product_price: 19990000,
        product_imgs: ['https://images.samsung.com/is/image/samsung/p6pim/vn/galaxy-tab-s9-ultra/images/gallery/galaxy-tab-s9-ultra-wifi-sm-x810-sm-x810nzaaxv-537012494?$650_519_PNG$'],
        product_category: ProductCategory.Laptop,
        product_attributes: {
          cpu: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '512GB',
          display: '14.6 inch AMOLED 120Hz',
        },
        product_stock: 15,
        product_sold_amount: 78,
        product_status: ProductStatus.Active,
      },
      {
        product_name: 'Dell XPS 13',
        product_description: 'Laptop siêu mỏng nhẹ, vỏ nhôm, hiệu năng mạnh với Intel i7 Gen 13.',
        product_slug: 'dell-xps-13',
        product_brand: 'Dell',
        product_price: 32990000,
        product_imgs: ['https://i.dell.com/sites/imagecontent/products/PublishingImages/xps-13-9310-laptop/spi/ng/xps-13-9310-laptop-spi-ng-gallery-1.jpg'],
        product_category: ProductCategory.Laptop,
        product_attributes: {
          cpu: 'Intel Core i7-1360P',
          ram: '16GB',
          storage: '512GB SSD',
          display: '13.4 inch FHD+ InfinityEdge',
        },
        product_stock: 8,
        product_sold_amount: 45,
        product_status: ProductStatus.Active,
      },
    ];
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
