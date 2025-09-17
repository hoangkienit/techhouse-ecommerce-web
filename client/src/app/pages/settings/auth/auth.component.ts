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

  constructor(private fb: FormBuilder, private appServices: AppServices) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
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
    if (this.signupForm.valid) {
      console.log('Signup data:', this.signupForm.value);
      // TODO: gọi API signup
      this.appServices.AuthService.RegisterAccount(this.signupForm.value).subscribe({
        next: response => {
          console.log('Signup successful:', response);
        },
        error: error => {
          console.error('Signup error:', error);
        }
      });
    }
  }
}
