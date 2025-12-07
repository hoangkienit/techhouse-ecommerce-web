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
tokenGlob: string | null = null;
  constructor(private fb: FormBuilder, private _appServices: AppServices, private route: ActivatedRoute) { }

  ngOnInit(): void {
  this.form = this.fb.group({
    token: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  this.prefillTokenFromPath();
  this.prefillTokenFromQuery(); // Optional vẫn giữ
}

 private prefillTokenFromPath() {
  let rawToken = this.route.snapshot.paramMap.get('token');

  if (rawToken) {
    if (rawToken.includes('=')) {
      rawToken = rawToken.split('=')[1];
    }

    this.form.patchValue({ token: rawToken });
    this.tokenGlob = rawToken;
  }
}

private prefillTokenFromQuery() {
  this.route.queryParams.subscribe(params => {
    const token = params['token'];
    if (token) {
      this.form.patchValue({ token });
      this.tokenGlob = token;
    }
  });
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
        this.isLoading = false
      },
      complete: () => this.isLoading = false
    });
  }
}
