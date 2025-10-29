import { AppServices } from './../../../@core/services/AppServices.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isInvalid: boolean = false;
  registerMsg: any = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private appServices: AppServices) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fullname: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // TODO: gọi API login
      this.appServices.AuthService.Login(this.loginForm.value).subscribe({
        next: response => {
          console.log('Login successful:', response);
        },
        error: error => {
          console.error('Login error:', error);
        }
      });
    }
  }

  onSignup() {
    console.log('Signup data:', this.signupForm.value);
    if (this.signupForm.valid) {
      this.isLoading = true;
      console.log('Signup form is valid');
      this.appServices.AuthService.RegisterAccount(this.signupForm.value).subscribe({
        next: response => {
          this.isInvalid = false;
          this.registerMsg = null;
          console.log('Signup successful:', response);
          this.isLoading = false;
        },
        error: e => {
          console.error('Signup error:', e.error.errors);
          this.isInvalid = true;
          this.registerMsg = e.error.errors;
          this.isLoading = false;
        }
      });
    }
  }
}
