import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';

@Component({
  selector: 'app-reset-request',
  templateUrl: './reset-request.component.html',
  styleUrls: ['./reset-request.component.scss']
})
export class ResetRequestComponent {
  form!: FormGroup;
  isLoading = false;
  token: string | null = null;
  expires: number | null = null;

  constructor(private fb: FormBuilder, private _appServices: AppServices) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this._appServices.UserService.ResetPassword(this.form.value.email).subscribe({
      next: res => {
        this.token = res.data?.token || null;
        this.expires = res.data?.expires || null;
        this._appServices.NotificationService.createNotification('Đã gửi yêu cầu đặt lại mật khẩu', NotificationStatus.SUCSSESS);
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this._appServices.NotificationService.createNotification(err.error?.message || 'Không thể tạo token', NotificationStatus.ERROR);
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }
}
