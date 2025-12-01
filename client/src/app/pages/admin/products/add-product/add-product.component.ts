import { StatusServiceTag } from './../../../../@core/services-components/ngx-tag/ngx-tag.component';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { Product } from 'src/app/@core/models/product.model';
import { TypeUpload } from 'src/app/@core/services-components/ngx-img-upload/ngx-img-upload.component';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  @Input() product: any;
  form!: FormGroup;
  statusTagService = StatusServiceTag;
  statusOptions = EnumService.ParseEnumToArray(ProductStatus);
  categoryOptions = EnumService.ParseEnumToArray(ProductCategory);
  isErrMsg: boolean = false;
  errMsg: string = null as any;
  isLoading: boolean = false;
  _typeUpload = TypeUpload;
  imgLs: File[] = [];
  _currencyHelper = new CurrencyHelper();

  constructor(private fb: FormBuilder, private readonly _appServices: AppServices) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      brand: [this.product?.brand || '', Validators.required],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0)]],
      status: [this.product?.status || this.statusTagService.ACTIVE, Validators.required],
      description: [this.product?.description || '', Validators.required],
      category: [this.product?.category || ProductCategory.Computer, Validators.required],
      stock: [this.product?.stock || 0, [Validators.required, Validators.min(0)]]
    });
  }

  addProduct() {
    const product = this.getProductFromForm();
    const formData = new FormData();

    // append từng field của product
    for (const key in product) {
      if ((product as any)[key] != null) {
        formData.append(key, (product as any)[key]);
      }
    }

    // append file
    this.imgLs.forEach(file => {
      formData.append('images', file); // backend đang expect 'images'
    });

    this.isLoading = true;
    if (this.form.valid) {
      this._appServices.ProductService.addProduct(formData).subscribe({
        next: (res) => {
          this._appServices.ModalService.closeModal();
          this._appServices.NotificationService.createNotification('Thêm sản phẩm thành công!', NotificationStatus.SUCSSESS, 3000);
          this.isErrMsg = true;
          this.errMsg = null as any;
          this.isLoading = false;
        },
        error: (e) => {
          this.isErrMsg = true;
          this.errMsg = e.error?.errors || e.error?.message || null as any;
          this.isLoading = false;
          this._appServices.NotificationService.createNotification('Thêm sản phẩm thất bại!', NotificationStatus.ERROR, 3000);
        }
      });
    } else {
      this.isLoading = false;
      this.form.markAllAsTouched();
    }
  }

  getProductFromForm(): Product {
    const f = this.form.value;
    console.log(this.imgLs)

    return {
      product_name: f.name,
      product_brand: f.brand,
      product_price: f.price,
      product_status: f.status,
      product_description: f.description,
      product_category: f.category.toLowerCase(),
      product_stock: f.stock,
      product_imgs: [],
      product_sold_amount: this.product?.product_sold_amount || 0,
      product_attributes: this.product?.product_attributes || {},
      short_description: this.product?.short_description || '',
      weight: this.product?.weight || '',
      dimensions: this.product?.dimensions || '',
      warranty: this.product?.warranty || '',
      tags: this.product?.tags || [],
      product_slug: this.product?.product_slug || '',
    };
  }

  onReceiveFiles(e: any) {
    this.imgLs = e;
  }

  onInputPrice(event: any) {
    const val = event.target.value;
    this._currencyHelper.setMinValue(val);
    this.form.patchValue({
      price: Number(this._currencyHelper.minValue.replace(/\./g, ''))
    });
  }
}