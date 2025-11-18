import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCategory, ProductStatus } from 'src/app/@core/enums/products/product.enum';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  @Input() product: any;
  form!: FormGroup;

  statusOptions = EnumService.ParseEnumToArray(ProductStatus);
  productCategories = EnumService.ParseEnumToArray(ProductCategory);

  constructor(private fb: FormBuilder, private readonly _appServices: AppServices) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      brand: [this.product?.brand || '', Validators.required],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0)]],
      status: [this.product?.status || 'available', Validators.required],
    });
  }

  add() {
    if (this.form.valid) {
      this.form.value;
      this._appServices.ProductService.addProduct(this.form.value).subscribe({
        next: (res) => {
          this._appServices.ModalService.closeModal();
          this._appServices.NotificationService.createNotification('Thêm sản phẩm thành công!', NotificationStatus.SUCSSESS, 3000);
        },
        error: (err) => {
          this._appServices.NotificationService.createNotification('Thêm sản phẩm thất bại!', NotificationStatus.ERROR, 3000);
        }
      });
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.product.product_imgs.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }
}
