import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { DiscountService } from 'src/app/@core/services/apis/discount.service';
import { AppServices } from 'src/app/@core/services/AppServices.service';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent {
  discounts: any[] = [];
  showCreateForm = false;
  createForm: FormGroup;

  constructor(
    private discountService: DiscountService,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private _appServices: AppServices
  ) {
    this.createForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      description: [''],
      percentage: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      usageLimit: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts() {
    this.discountService.getDiscounts().subscribe(res => {
      this.discounts = res.data.discounts;
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  createDiscount() {
    if (this.createForm.invalid) return;
    const payload = this.createForm.value;
    this.discountService.createDiscount(payload).subscribe({
      next: res => {
        this.toastrService.success('Tạo mã giảm giá thành công!');
        this.createForm.reset({ percentage: 0, usageLimit: 1 });
        this.showCreateForm = false;
        this.loadDiscounts();
      },
      error: err => {
        this.toastrService.danger(err.error?.message || 'Lỗi tạo mã giảm giá');
      }
    });
  }

  deactivate(code: string) {
    this._appServices.ModalService.createConfirmDialog(
      'Bạn có chắc chắn muốn vô hiệu hóa mã này không?',
      'Xác nhận',
      'Xác nhận',
      'Thoát',
      () => this.deactivate(code)
    )
  }

  deactivateAction(code: string) {
    this.discountService.deactivateDiscount(code).subscribe({
      next: res => {
        this.toastrService.info('Mã giảm giá đã bị vô hiệu hóa');
        this.loadDiscounts();
      },
      error: err => {
        this.toastrService.danger(err.error?.message || 'Lỗi vô hiệu hóa mã giảm giá');
      }
    });
  }
  get activeDiscountsCount(): number {
    return this.discounts.filter(d => d.isActive).length;
  }

  get inactiveDiscountsCount(): number {
    return this.discounts.filter(d => !d.isActive).length;
  }
}
