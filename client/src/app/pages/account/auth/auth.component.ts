import { AppServices } from './../../../@core/services/AppServices.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { AuthDtos } from 'src/app/@core/models/auth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isInvalidRegister: boolean = false;
  isInvalidLogin: boolean = false;
  registerMsg: any = null;
  loginMsg: any = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private appServices: AppServices) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.appServices.AuthService.Login(this.loginForm.value).subscribe({
        next: response => {
          console.log('Login successful:', response);
          this.appServices.NotificationService.createNotification(
            this.appServices.TranslateService.instant('auth.success-login'),
            NotificationStatus.SUCSSESS
          );
          this.isInvalidLogin = false;
          this.loginMsg = null;
          this.isLoading = false;
          this.loginForm.reset();
          // this.appServices.AuthService.StoreToken(response.token);
          // this.appServices.AuthService.StoreUserInfo(response.user);
          // this.appServices.NavigationService.navigateToHome();
        },
        error: e => {
          this.isInvalidLogin = true;
          this.loginMsg = e.error.errors;
          this.isLoading = false;
        }
      });
    }
    else {
      this.isInvalidLogin = true;
      this.loginMsg = this.appServices.TranslateService.instant('auth.validate-err-login');
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const formValues = this.signupForm.value;
      const registerData: AuthDtos = {
        fullname: formValues.fullname,
        email: formValues.email,
        address: {
          country: formValues.country,
          city: formValues.city,
          street: formValues.street
        }
      }
      this.appServices.AuthService.RegisterAccount(registerData).subscribe({
        next: response => {
          this.isInvalidRegister = false;
          this.registerMsg = null;
          const successMsg = this.appServices.TranslateService.instant('auth.success-register');
          this.appServices.NotificationService.createNotification(successMsg, NotificationStatus.SUCSSESS);
          this.signupForm.reset();
          this.isLoading = false;
        },
        error: e => {
          this.isInvalidRegister = true;
          this.registerMsg = e.error.errors;
          this.isLoading = false;
        }
      });
    } else {
      this.isInvalidRegister = true;
      this.registerMsg = this.appServices.TranslateService.instant('auth.validate-err-register');
    }
  }
}
