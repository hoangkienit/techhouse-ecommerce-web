import { Component, Input, Type, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
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

  ngOnInit() {
    const compRef = this.bodyContainer.createComponent(this.bodyComponent);
    if (this.context) {
      Object.assign(compRef.instance, this.context);
    }
  }
}
