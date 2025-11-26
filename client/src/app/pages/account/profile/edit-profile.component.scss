import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appServices: AppServices,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.appServices.GlobalStateService.getUser();

    this.editForm = this.fb.group({
      fullname: [user.fullname, Validators.required],
      email: [user.email, Validators.required],
      country: [user.address?.country],
      city: [user.address?.city],
      street: [user.address?.street],
    });
  }

  onSave() {
    if (this.editForm.valid) {
      console.log("Dữ liệu gửi API:", this.editForm.value);

      // TODO: Gọi API update user
      this.appServices.NotificationService.createSuccess("Cập nhật thành công!");

      this.router.navigate(['/account/profile']);
    }
  }
}
