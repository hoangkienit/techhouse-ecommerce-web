import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { AuthDtos } from 'src/app/@core/models/auth.model';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  signupForm!: FormGroup;
  isInvalidRegister = false;
  registerMsg: any = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private appServices: AppServices,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
    });
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
      };

      this.appServices.AuthService.RegisterAccount(registerData).subscribe({
        next: response => {
          this.isInvalidRegister = false;
          this.registerMsg = null;

          const successMsg = this.appServices.TranslateService.trans('auth.success-register');
          this.appServices.NotificationService.createNotification(successMsg, NotificationStatus.SUCSSESS);

          this.signupForm.reset();
          this.isLoading = false;
          // setTimeout(() => {
          //   this.router.navigate(['/account/auth/login']);
          // }, 1000)
        },
        error: e => {
          this.registerMsg = e.error.errors;

          if (this.registerMsg)
            this.isInvalidRegister = true;

          this.isLoading = false;
        }
      });

    } else {
      this.isInvalidRegister = true;
      this.registerMsg = this.appServices.TranslateService.trans('auth.validate-err-register');
    }
  }
}
