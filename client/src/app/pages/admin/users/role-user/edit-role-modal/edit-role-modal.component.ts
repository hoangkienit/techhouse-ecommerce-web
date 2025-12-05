import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-edit-role-modal',
  templateUrl: './edit-role-modal.component.html',
  styleUrls: ['./edit-role-modal.component.scss']
})
export class EditRoleModalComponent {
  @Input() roleName: string = '';
  @Input() permissions: string[] = [];           // danh sách quyền
  @Input() selectedPermissions: string[] = [];   // quyền đang có

  constructor(
    protected dialogRef: NbDialogRef<EditRoleModalComponent>
  ) { }

  togglePermission(p: string) {
    if (this.selectedPermissions.includes(p)) {
      this.selectedPermissions = this.selectedPermissions.filter(x => x !== p);
    } else {
      this.selectedPermissions.push(p);
    }
  }

  save() {
    this.dialogRef.close({
      roleName: this.roleName,
      permissions: this.selectedPermissions
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
