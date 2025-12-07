import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private _appServices: AppServices, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.prefillToken();
  }

  private prefillToken() {
    let token = this.route.snapshot.paramMap.get('token') || this.route.snapshot.queryParamMap.get('token') || undefined;

    if (!token) {
      const raw = window.location.href;
      const match = raw.match(/token=([^&]+)/);
      if (match && match[1]) {
        token = match[1];
      } else {
        const afterReset = raw.split('reset-password/')[1] || '';
        if (afterReset) {
          token = afterReset.split('?')[0];
        }
      }
    }

    if (token) {
      if (token.startsWith('token=')) {
        token = token.slice('token='.length);
      }
      this.form.patchValue({ token });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this._appServices.UserService.ResetPasswordCallback(this.form.value.token, this.form.value.newPassword).subscribe({
      next: () => {
        this._appServices.NotificationService.createNotification('Đặt lại mật khẩu thành công', NotificationStatus.SUCSSESS);
        this.form.reset();
      },
      error: err => {
        console.error(err);
        this._appServices.NotificationService.createNotification(err.error?.message || 'Không thể đặt lại mật khẩu', NotificationStatus.ERROR);
      },
      complete: () => this.isLoading = false
    });
  }
}
