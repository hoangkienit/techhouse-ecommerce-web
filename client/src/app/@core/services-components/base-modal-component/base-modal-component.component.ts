import { Component, Input, Type, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
@Component({
  selector: 'app-base-modal-component',
  templateUrl: './base-modal-component.component.html',
  styleUrls: ['./base-modal-component.component.scss']
})
export class BaseModalComponentComponent {
  @Input() header!: string;
  @Input() bodyComponent!: Type<any>;
  @Input() context?: any;
  @Input() close!: () => void;

  @ViewChild('bodyContainer', { read: ViewContainerRef, static: true })
  bodyContainer!: ViewContainerRef;

  constructor(private dialogRef: NbDialogRef<BaseModalComponentComponent>) { }

  ngOnInit() {
    const compRef = this.bodyContainer.createComponent(this.bodyComponent);
    if (this.context) {
      Object.assign(compRef.instance, this.context);
      this.context.dialogRef = this.dialogRef; // <-- truyền ref cho component con
    }
  }
}