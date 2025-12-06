import { Component, OnInit } from '@angular/core';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { Paging } from 'src/app/@core/models/paging.model';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { filterOrder, getOrderStatusLabel, Order, OrderStatus, OrderStatusEnum } from 'src/app/@core/models/order.model';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { ViewOrderComponent } from './view-order/view-order.component';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  _paging: Paging = new Paging();
  isLoading: boolean = false;
  filter: filterOrder = {};

  selectedStatus: OrderStatus | '' = '';
  selectedSort: 'newest' | 'oldest' | '' = '';
  searchOrderCode: string = '';
  searchKeyword: string = '';
  filterUserId?: string;
  filterGuestId?: string;

  orderStatusList = EnumService.ParseEnumToArray(OrderStatusEnum);
  getOrderStatusLabel = getOrderStatusLabel;
  _statusServiceTag = StatusServiceTag;

  constructor(private _appService: AppServices) { }

  ngOnInit() {
    this._paging.setPaging(1, 10, 0);
    this.loadOrders();
  }

  onFilterChange() {
    this._paging.setPageIndex(1); // reset page
    this.filter = {
      status: this.selectedStatus,
      sort: this.selectedSort || undefined,
      q: this.searchKeyword,
      orderCode: this.searchOrderCode,
    };
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    const params = {
      ...this.filter,
      ...this._paging.getPagingParams()
    };

    this._appService.OrderService.getOrders(params).subscribe({
      next: (res) => {
        this.orders = res.data?.orders || [];
        this._paging.setPaging(res.data?.pagination?.pageIndex, res.data?.pagination?.pageSize, res.data?.pagination?.totalItems);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  onPageChange(e: { pageIndex: number, pageSize: number }) {
    this._paging.setPageIndex(e.pageIndex);
    this._paging.setPageSize(e.pageSize);
    this.loadOrders();
  }

  viewOrderDetail(order: any) {
    const ref = this._appService.ModalService.createModal(
      'Chi tiết đơn hàng',
      ViewOrderComponent,
      { order }
    );

    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadOrders(); // load lại bảng
      }
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    this._appService.OrderService.updateOrderStatus(orderId, status).subscribe(() => {
      this.loadOrders();
    });
  }

  deleteOrder(orderId: string) {
    this._appService.OrderService.deleteOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }
}