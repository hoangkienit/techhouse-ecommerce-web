import { UserStatus } from './../../../@core/enums/users/user.enum';
import { Component } from '@angular/core';
import { SortAction } from 'src/app/@core/enums/sort.enum';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { UserRoles } from 'src/app/@core/constants/role.constant';
import { filterUser, UserDtoResponse } from 'src/app/@core/models/user.model';
import { EditUserComponent } from './edit-user/edit-user.component';
import { Subscription } from 'rxjs';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { UpdateLoyaltyModalComponent } from './update-loyalty/update-loyalty-modal/update-loyalty-modal.component';
import { EditRoleModalComponent } from './role-user/edit-role-modal/edit-role-modal.component';
import { Paging } from 'src/app/@core/models/paging.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: UserDtoResponse[] = [];
  roles = UserRoles;
  userStatus = UserStatus;
  _statusServiceTag = StatusServiceTag;
  _currencyHelper: any;
  isLoading: boolean = false;
  _paging: Paging = new Paging();
  filter: filterUser = {};

  selectedRole: any = '';
  selectedStatus: any = '';
  searchName: string = '';
  searchEmail: string = '';
  searchPhone: string = '';

  subs = new Subscription();

  rolesList = EnumService.ParseEnumToArray(this.roles);
  userStatusList = EnumService.ParseEnumToArray(this.userStatus);
  SortActionLs = EnumService.ParseEnumToArray(SortAction);

  params: any = null;

  constructor(private _appService: AppServices) { }

  ngOnInit() {
    this._paging.setPaging(1, 10, 0);
    this.params = this._paging.getPagingParams();
    this._currencyHelper = new CurrencyHelper();
    this.loadUsers();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onFilterChange() {
    this.filter = {
      fullname: this.searchName.toLowerCase(),
      email: this.searchEmail.toLowerCase(),
      phone: this.searchPhone.toLowerCase(),
      role: this.selectedRole.toLowerCase(),
      isBanned: this.selectedStatus.toLowerCase() == this.userStatus.BANDED,
    }

    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.params = {
      ...this.filter,
      ...this._paging.getPagingParams()
    }
    const s = this._appService.UserService.GetAllUsers(this.params).subscribe({
      next: (res) => {
        this._paging.setPaging(res.data?.pageIndex, res.data?.pageSize, res.data?.total)
        this.users = res.data?.users || [];
      },
      error: (e) => {
        console.error('Error fetching products:', e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    this.subs.add(s);
  }

  openEditModalUser(user: any) {
    const ref = this._appService.ModalService.createModal(
      'Thông tin tài khoản người dùng',
      EditUserComponent,
      { user }
    );

    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadUsers(); // load lại bảng
      }
    });
  }

  onPageChange(e: { pageIndex: number, pageSize: number }) {
    this._paging.setPageIndex(e.pageIndex);
    this._paging.setPageSize(e.pageSize);
    this.loadUsers();
  }

  confirmCheck(u: any) {
    const msg = [
      'Bạn có chắc muốn muốn khóa tài khoản này không?',
      'Bạn có chắc muốn muốn mở khóa tài khoản này không?'
    ]
    this._appService.ModalService.createConfirmDialog(
      u.isBanned ? msg[1] : msg[0],
      'Xác nhận',
      'Xác nhận',
      'Thoát',
      () => this.bandAccHandle(u),
      () => { }
    );
  }

  bandAccHandle(u: any) {
    this.isLoading = true;
    const params = {
      userId: u._id,
      status: !u.isBanned
    }
    const s = this._appService.UserService.BandUserById(params).subscribe({
      next: (res) => {
        // console.log(res)
      },
      error: (e) => {
        this.isLoading = false;
        this._appService.NotificationService.createNotification('Có lỗi khi thay đổi trạng thái tài khoản!!', NotificationStatus.ERROR);
        console.log(e);
      },
      complete: () => {
        this._appService.NotificationService.createNotification('Thay đổi trạng thái tài khoản thành công', NotificationStatus.SUCSSESS);
        this.loadUsers();
        this.isLoading = false;
      }
    })
    this.subs.add(s);
  }
  openEditModalLoyalty(user: any) {
    const ref = this._appService.ModalService.createModal("Cập nhật điểm thành viên", UpdateLoyaltyModalComponent, { user });

    ref.onClose.subscribe({
      next: () => {
        this.loadUsers();
      }
    })
  }

  openEditRoleModal(user: any) {
    const ref = this._appService.ModalService.createModal("Thay đổi quền tài khoản", EditRoleModalComponent, { user });

    ref.onClose.subscribe({
      next: () => {
        this.loadUsers();
      }
    })
  }
}
