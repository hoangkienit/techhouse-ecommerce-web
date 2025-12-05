import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog-base-body',
  templateUrl: './confirm-dialog-base-body.component.html',
  styleUrls: ['./confirm-dialog-base-body.component.scss']
})
export class ConfirmDialogBaseBodyComponent {
  @Input() message!: string;
  @Input() okText: string = 'OK';
  @Input() cancelText: string = 'Cancel';
  @Input() confirm!: () => void;
  @Input() cancel!: () => void;
}
