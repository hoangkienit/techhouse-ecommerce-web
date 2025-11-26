import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-tag',
  templateUrl: './ngx-tag.component.html',
  styleUrls: ['./ngx-tag.component.scss']
})
export class NgxTagComponent {
  @Input() TagStatus: any = StatusServiceTag.DEFAULT;
  @Input() text: string = '';

  ngOnInit() {
    console.log(this.TagStatus);
  }

  mappingColor(status: StatusServiceTag): string {
    switch (status) {
      case StatusServiceTag.PRIMARY:
        return '#5A5CE6'; // Indigo soft modern

      case StatusServiceTag.SUCCESS:
        return '#3DD9B6'; // Soft mint neon

      case StatusServiceTag.INFO:
        return '#2BAFDA'; // Teal-blue hiện đại

      case StatusServiceTag.WARNING:
        return '#FFB65C'; // Amber pastel sang

      case StatusServiceTag.DANGER:
        return '#FF5C5C'; // Red punchy nhưng sạch

      case StatusServiceTag.ACTIVE:
        return '#5CD67A'; // Lime fresh active

      case StatusServiceTag.INACTIVE:
        return '#CED4DA'; // Xám lạnh minimal

      default:
        return '#ADB5BD'; // Xám trung tính mềm
    }
  }
}

export enum StatusServiceTag {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}