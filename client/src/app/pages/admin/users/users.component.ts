import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/@core/services/apis/user.service';
import { Paging } from 'src/app/@core/models/paging.model';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: AdminUser[] = [];
  _statusServiceTag = StatusServiceTag;
  isLoading: boolean = false;
  _paging: Paging = new Paging();
  filter: any = {};

  selectedRole: string = '';
  searchName: string = '';
  selectedUser: AdminUser | null = null;
  editForm: Partial<AdminUser> = {};

  roleList = ['admin', 'customer', 'moderator'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this._paging.setPaging(1, 10, 0);
    this.loadUsers();
  }

  onFilterChange(): void {
    this.filter = {
      role: this.selectedRole.toLowerCase() || undefined,
      q: this.searchName || undefined
    };
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    const params = {
      ...this.filter,
      ...this._paging.getPagingParams()
    };

    this.userService.getAllUsers(params).subscribe({
      next: (res) => {
        this._paging.setPaging(res.data?.pagination?.pageIndex, res.data?.pagination?.pageSize, res.data?.pagination?.totalItems);
        this.users = res.data?.users || [];
      },
      error: (e) => {
        console.error('Error fetching users:', e);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  toggleUserStatus(user: AdminUser): void {
    const updatedStatus = user.isActive ? 'inactive' : 'active';
    this.userService.updateUserStatus(user.id, updatedStatus).subscribe({
      next: () => {
        user.isActive = !user.isActive;
      },
      error: (e) => console.error('Error updating user status:', e)
    });
  }

  openEditModalUser(user: AdminUser): void {
    this.selectedUser = { ...user };
    this.editForm = { ...user };
  }

  saveUser(): void {
    if (!this.selectedUser) return;
    this.userService.updateUser(this.selectedUser.id, this.editForm).subscribe({
      next: () => {
        this.users = this.users.map(u => u.id === this.selectedUser?.id ? { ...u, ...this.editForm } as AdminUser : u);
        this.closeEdit();
      },
      error: (e) => console.error('Error updating user:', e)
    });
  }

  closeEdit(): void {
    this.selectedUser = null;
    this.editForm = {};
  }

  openAddModalUser(): void {
    // integrate add-user modal here
  }

  onPageChange(e: { pageIndex: number, pageSize: number }): void {
    this._paging.setPageIndex(e.pageIndex);
    this._paging.setPageSize(e.pageSize);
    this.loadUsers();
  }
}
