import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDtoRequest } from 'src/app/@core/models/auth.model';
import { GlobalStateService } from 'src/app/@core/services/GlobalStateService.service';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { AddressDto } from 'src/app/@core/models/address.model';

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  user: UserDtoRequest | null = null;
  changePassForm!: FormGroup;
  isSubmitting = false;
  addresses: AddressDto[] = [];
  addressForm!: FormGroup;
  editingAddressId: string | null = null;
  isAddressLoading = false;

  constructor(private state: GlobalStateService, private fb: FormBuilder, private appServices: AppServices) { }

  ngOnInit(): void {
    this.user = this.state.currentUser;
    this.changePassForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.addressForm = this.fb.group({
      label: [''],
      fullName: ['', Validators.required],
      phone: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      postalCode: [''],
      country: ['Vietnam', Validators.required],
      isDefault: [false]
    });

    this.loadAddresses();
  }

  onChangePassword() {
    if (this.changePassForm.invalid) {
      this.changePassForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.changePassForm.value;
    if (newPassword !== confirmPassword) {
      this.appServices.NotificationService.createNotification('Mật khẩu xác nhận không khớp', NotificationStatus.ERROR);
      return;
    }

    this.isSubmitting = true;
    this.appServices.UserService.ChangePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.appServices.NotificationService.createNotification('Đổi mật khẩu thành công', NotificationStatus.SUCSSESS);
        this.changePassForm.reset();
      },
      error: err => {
        console.error(err);
        this.appServices.NotificationService.createNotification(err.error?.message || 'Đổi mật khẩu thất bại', NotificationStatus.ERROR);
      },
      complete: () => this.isSubmitting = false
    });
  }

  loadAddresses() {
    this.isAddressLoading = true;
    this.appServices.AddressService.GetAddressesByUser().subscribe({
      next: res => {
        this.addresses = res.data?.addresses || [];
      },
      error: err => {
        console.error(err);
        this.appServices.NotificationService.createNotification('Không thể tải địa chỉ', NotificationStatus.ERROR);
      },
      complete: () => this.isAddressLoading = false
    });
  }

  editAddress(addr: any) {
    this.editingAddressId = addr._id || null;
    this.addressForm.patchValue({
      label: addr.label || '',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'Vietnam',
      isDefault: !!addr.isDefault
    });
  }

  resetAddressForm() {
    this.editingAddressId = null;
    this.addressForm.reset({ country: 'Vietnam', isDefault: false });
  }

  submitAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.isAddressLoading = true;
    const payload = this.addressForm.value;

    const req$ = this.editingAddressId
      ? this.appServices.AddressService.UpdateAddress(this.editingAddressId, payload)
      : this.appServices.AddressService.CreateAddress(payload);

    req$.subscribe({
      next: () => {
        this.appServices.NotificationService.createNotification(
          this.editingAddressId ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công',
          NotificationStatus.SUCSSESS
        );
        this.resetAddressForm();
        this.loadAddresses();
      },
      error: err => {
        console.error(err);
        this.appServices.NotificationService.createNotification(err.error?.message || 'Không thể lưu địa chỉ', NotificationStatus.ERROR);
        this.isAddressLoading = false;
      }
    });
  }

  deleteAddress(addr: any) {
    if (!addr?._id) return;
    this.isAddressLoading = true;
    this.appServices.AddressService.DeleteAddress(addr._id).subscribe({
      next: () => {
        this.appServices.NotificationService.createNotification('Xoá địa chỉ thành công', NotificationStatus.SUCSSESS);
        this.loadAddresses();
      },
      error: err => {
        console.error(err);
        this.appServices.NotificationService.createNotification(err.error?.message || 'Không thể xoá địa chỉ', NotificationStatus.ERROR);
        this.isAddressLoading = false;
      }
    });
  }

  setDefault(addr: any) {
    if (!addr?._id) return;
    this.isAddressLoading = true;
    this.appServices.AddressService.SetDefault(addr._id).subscribe({
      next: () => {
        this.appServices.NotificationService.createNotification('Đặt địa chỉ mặc định thành công', NotificationStatus.SUCSSESS);
        this.loadAddresses();
      },
      error: err => {
        console.error(err);
        this.appServices.NotificationService.createNotification(err.error?.message || 'Không thể cập nhật', NotificationStatus.ERROR);
        this.isAddressLoading = false;
      }
    });
  }
}
