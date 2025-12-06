import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { OrderStatusEnum } from 'src/app/@core/models/order.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent {
  @Input() order: any;

  orderStatusSteps = [
    OrderStatusEnum.PENDING,
    OrderStatusEnum.CONFIRMED,
    OrderStatusEnum.PAID,
    OrderStatusEnum.FULFILLED,
    OrderStatusEnum.CANCELLED
  ];

  selectedStatus: OrderStatusEnum | null = null;
  showStatusSelect = false;

  constructor(private dialogRef: NbDialogRef<ViewOrderComponent>, private _appServices: AppServices) { }

  get currentStatusIndex() {
    return this.orderStatusSteps.indexOf(this.order.status);
  }

  getStepLabel(status: OrderStatusEnum) {
    switch (status) {
      case OrderStatusEnum.PENDING: return "Chờ xử lý";
      case OrderStatusEnum.CONFIRMED: return "Đã xác nhận";
      case OrderStatusEnum.PAID: return "Đã thanh toán";
      case OrderStatusEnum.FULFILLED: return "Đang giao / Hoàn tất";
      case OrderStatusEnum.CANCELLED: return "Đã hủy";
      default: return "Không rõ";
    }
  }

  getStepIcon(status: OrderStatusEnum) {
    switch (status) {
      case OrderStatusEnum.PENDING: return "clock-outline";
      case OrderStatusEnum.CONFIRMED: return "checkmark-circle-2-outline";
      case OrderStatusEnum.PAID: return "credit-card-outline";
      case OrderStatusEnum.FULFILLED: return "car-outline";
      case OrderStatusEnum.CANCELLED: return "close-circle-outline";
      default: return "alert-circle-outline";
    }
  }

  openStatusMenu() {
    this.showStatusSelect = true;
    this.selectedStatus = this.order.status;
  }

  updateStatus() {
    if (!this.selectedStatus) return;

    this.order.status = this.selectedStatus;

    // this.dialogRef.close({
    //   updated: true,
    //   status: this.selectedStatus
    // });
  }

  updateOrderStatus(orderId: string, status: string) {
    this._appServices.OrderService.updateOrderStatus(orderId, status).subscribe(() => {
    });
  }

  close() {
    this.dialogRef.close();
  }
}
