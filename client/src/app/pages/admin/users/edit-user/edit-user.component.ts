import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { TypeUpload } from 'src/app/@core/services-components/ngx-img-upload/ngx-img-upload.component';
import { UserRoles } from 'src/app/@core/constants/role.constant';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { AddressDto } from 'src/app/@core/models/address.model';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  @Input() user: any;

  isLoading = false;

  addresses: AddressDto[] = [];
  statusServiceTag = StatusServiceTag;
  subs = new Subscription();

  form!: FormGroup;
  // isErrMsg = false;
  // errMsg: string | null = null;
  // isLoading = false;
  // imgFile: File | null = null;
  // _typeUpload = TypeUpload;

  // selectedRole: string = '';
  // roles = UserRoles;
  // rolesList = EnumService.ParseEnumToArray(this.roles);

  constructor(
    private fb: FormBuilder,
    private readonly _appServices: AppServices
  ) { }

  ngOnInit(): void {
    console.log(this.user)
    // this.form = this.fb.group({
    //   userId: [this.user?._id, Validators.required],
    //   fullname: [this.user?.fullname ?? '', Validators.required],
    //   email: [this.user?.email ?? '', [Validators.required, Validators.email]],
    //   phone: [this.user?.phone ?? ''],
    //   role: [this.user?.role ?? 'user', Validators.required],
    //   isBanned: [this.user?.isBanned ?? false],
    //   loyalty_points: [this.user?.loyalty_points ?? 0, Validators.min(0)],
    // });

    this.loadAddresses();
  }

  loadAddresses() {
    this.subs.add(this._appServices.AddressService.GetAddressesByUserId(this.user._id).subscribe({
      next: (res) => {
        this.addresses = res.data?.addresses;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.isLoading = false;
      }
    }))
  }

  formatAddress(a: any): string {
    if (!a) return '';
    return [a?.street, a?.city, a?.state, a?.country].filter(x => !!x).join(', ');
  }

  changeLoyalty() {
    // this.subs.add(
    //   this._appServices.
    // )
  }

  // onReceiveFiles(files: File[]) {
  //   this.imgFile = files?.length ? files[0] : null;
  // }

  // editUser() {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   const f = this.form.value;

  //   const formData = new FormData();
  //   formData.append('fullname', f.fullname);
  //   formData.append('email', f.email);
  //   formData.append('phone', f.phone);
  //   formData.append('role', f.role);
  //   formData.append('isBanned', f.isBanned ? 'true' : 'false');
  //   formData.append('loyalty_points', f.loyalty_points.toString());

  //   if (this.imgFile) {
  //     formData.append('profileImg', this.imgFile);
  //   }

  //   this.isLoading = true;

  //   this._app.UserService.UpdateUserById(f.userId, formData).subscribe({
  //     next: () => { },
  //     error: (e) => {
  //       this.isLoading = false;
  //       this.isErrMsg = true;
  //       this.errMsg = e.error?.message || 'Cập nhật thất bại!';
  //       this._app.NotificationService.createNotification(
  //         'Cập nhật thất bại',
  //         NotificationStatus.ERROR,
  //         3000
  //       );
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //       this.isErrMsg = false;
  //       this.errMsg = null;

  //       this._app.NotificationService.createNotification(
  //         'Cập nhật thành công!',
  //         NotificationStatus.SUCSSESS,
  //         3000
  //       );

  //       this._app.ModalService.closeModal(true);
  //     },
  //   });
  // }
}