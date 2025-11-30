import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup;
  isInvalidLogin = false;
  loginMsg: any = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private appServices: AppServices
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.appServices.AuthService.Login(this.loginForm.value).subscribe({
        next: response => {
          this.appServices.GlobalStateService.setUser(response.data.user._doc);

          this.appServices.NotificationService.createNotification(
            this.appServices.TranslateService.trans('auth.success-login'),
            NotificationStatus.SUCSSESS
          );

          this.isInvalidLogin = false;
          this.loginMsg = null;
          this.loginForm.reset();
          this.isLoading = false;
        },
        error: e => {
          this.loginMsg = e.error?.errors || null;

          if (this.loginMsg)
            this.isInvalidLogin = true;

          this.isLoading = false;
        }
      });

    } else {
      this.isInvalidLogin = true;
      this.loginMsg = this.appServices.TranslateService.trans('auth.validate-err-login');
    }
  }

  googleLogin() {
    this.appServices.AuthService.LoginGoogle().subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }
}
