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

  mappingColor(status: StatusServiceTag | string): string {
    switch (status) {
      case StatusServiceTag.PRIMARY: return '#4F46E5';
      case StatusServiceTag.SUCCESS: return '#10B981';
      case StatusServiceTag.INFO: return '#0EA5E9';
      case StatusServiceTag.WARNING: return '#F59E0B';
      case StatusServiceTag.DANGER: return '#EF4444';
      case StatusServiceTag.ACTIVE: return '#22C55E';
      case StatusServiceTag.INACTIVE:
      case StatusServiceTag.BANDED: return '#94A3B8';

      // Order status
      case StatusServiceTag.PENDING: return '#FBBF24';     // Amber 400 - đang chờ
      case StatusServiceTag.CONFIRMED: return '#3B82F6';   // Blue 500 - đã xác nhận
      case StatusServiceTag.PAID: return '#10B981';        // Green 500 - đã thanh toán
      case StatusServiceTag.FULFILLED: return '#0EA5E9';   // Sky 500 - đã giao
      case StatusServiceTag.CANCELLED: return '#EF4444';   // Red 500 - hủy

      default: return '#CBD5E1'; // Slate 300
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
  BANDED = 'banded',

  // Order Status
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled'
}
