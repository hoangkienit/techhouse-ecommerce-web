import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { Product } from 'src/app/@core/models/product.model';
import { TypeUpload } from 'src/app/@core/services-components/ngx-img-upload/ngx-img-upload.component';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
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
  selectedCategory: string = '';

  constructor(private fb: FormBuilder, private readonly _appServices: AppServices) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      productId: [this.product?._id || '', Validators.required],
      name: [this.product?.product_name || '', Validators.required],
      brand: [this.product?.product_brand || '', Validators.required],
      price: [this.product?.product_price || 0, [Validators.required, Validators.min(0)]],
      status: [this.product?.product_status || this.statusTagService.ACTIVE, Validators.required],
      description: [this.product?.product_description || '', Validators.required],
      category: [this.product?.product_category || ProductCategory.Computer, Validators.required],
      stock: [this.product?.product_stock || 0, [Validators.required]],
      cpu: [this.product?.product_attributes?.cpu || ''],
      ram: [this.product?.product_attributes?.ram || ''],
      storage: [this.product?.product_attributes?.storage || ''],
      screen: [this.product?.product_attributes?.screen || ''],
      color: [this.product?.product_attributes?.color || ''],
    });

    this.patchValues();
  }

  patchValues() {
    this.onPatchPrice(this.product.product_price);
    this.selectedCategory = this.categoryOptions.find(e => e.value.toLocaleLowerCase().includes(this.product.product_category))?.value || '';
  }

  editProduct() {
    const product = this.getProductFromForm();
    const formData = new FormData();

    // append từng field của product
    for (const key in product) {
      const value = (product as any)[key];

      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    }

    // append file
    this.imgLs.forEach(file => {
      formData.append('images', file); // backend đang expect 'images'
    });

    this.isLoading = true;
    if (this.form.valid) {
      this._appServices.ProductService.updateProducts(formData, this.form.value.productId).subscribe({
        next: (res) => { },
        error: (e) => {
          this.isErrMsg = true;
          this.errMsg = e.error?.errors || e.error?.message || null as any;
          this._appServices.NotificationService.createNotification('Cập nhật sản phẩm thất bại!', NotificationStatus.ERROR, 3000);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this._appServices.NotificationService.createNotification('Cập nhật sản phẩm thành công!', NotificationStatus.SUCSSESS, 3000);
          this.isErrMsg = false;
          this.errMsg = null as any;
          this._appServices.ModalService.closeModal(true);
        }
      });
    } else {
      this.isLoading = false;
      this.form.markAllAsTouched();
    }
  }

  getProductFromForm(): Product {
    const f = this.form.value;

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
      short_description: this.product?.short_description || '',
      weight: this.product?.weight || '',
      dimensions: this.product?.dimensions || '',
      warranty: this.product?.warranty || '',
      tags: this.product?.tags || [],
      product_slug: this.product?.product_slug || '',
      product_attributes: {
        cpu: f.cpu || '',
        ram: f.ram || '',
        storage: f.storage || '',
        screen: f.screen || '',
        color: f.color || '',
      }
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

  onPatchPrice(price: any) {
    const val = price;
    this._currencyHelper.setMinValue(val);
    this.form.patchValue({
      price: Number(this._currencyHelper.minValue.replace(/\./g, ''))
    });
  }
}
