import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  @Input() product: any; // nhận dữ liệu từ modal service
  form!: FormGroup;

  statusOptions = [
    { label: 'Còn hàng', value: 'available' },
    { label: 'Hết hàng', value: 'unavailable' },
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      brand: [this.product?.brand || '', Validators.required],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0)]],
      status: [this.product?.status || 'available', Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      // trả về dữ liệu đã chỉnh sửa cho modal service
      return this.form.value;
    }
    return null;
  }
}
