import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalStateService } from 'src/app/@core/services/GlobalStateService.service';
import { User } from 'src/app/@core/models/auth.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  editForm!: FormGroup;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private appServices: GlobalStateService
  ) {}

  ngOnInit(): void {
    this.user = this.appServices.currentUser;

    this.editForm = this.fb.group({
      fullname: [this.user?.fullname, [Validators.required]],
      email: [this.user?.email, [Validators.required, Validators.email]],
      country: [this.user?.address?.country],
      city: [this.user?.address?.city],
      street: [this.user?.address?.street]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedUser = { ...this.user, ...this.editForm.value };
      this.appServices.setUser(updatedUser);  // Cập nhật thông tin người dùng
      console.log('Thông tin người dùng đã được cập nhật:', updatedUser);
    }
  }
}
