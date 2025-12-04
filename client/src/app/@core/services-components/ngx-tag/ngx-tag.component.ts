import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-tag',
  templateUrl: './ngx-tag.component.html',
})
export class NgxTagComponent {
  @Input() TagStatus: any = StatusServiceTag.DEFAULT;
  @Input() text: string = '';

  ngOnInit() {
  }

  mappingColor(status: StatusServiceTag): string {
    switch (status) {
      case StatusServiceTag.PRIMARY:
        return '#4F46E5'; // Indigo 600 - modern, giống Bootstrap primary mới

      case StatusServiceTag.SUCCESS:
        return '#10B981'; // Emerald 500 - fresh xanh ngọc

      case StatusServiceTag.INFO:
        return '#0EA5E9'; // Sky 500 - xanh info chuẩn UX

      case StatusServiceTag.WARNING:
        return '#F59E0B'; // Amber 500 - sang, không bị neon

      case StatusServiceTag.DANGER:
        return '#EF4444'; // Red 500 - đỏ modern, không quá chóe

      case StatusServiceTag.ACTIVE:
        return '#22C55E'; // Green 500 - active đúng nghĩa, tươi vừa

      case StatusServiceTag.INACTIVE || StatusServiceTag.BANDED:
        return '#94A3B8'; // Slate 400 - xám smoooooth minimal

      default:
        return '#CBD5E1'; // Slate 300 - nhạt nhẹ kiểu macOS
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
  BANDED = 'banded'
}