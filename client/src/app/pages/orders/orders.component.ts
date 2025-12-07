import { Component, OnInit } from '@angular/core';
import { Order, filterOrder, getOrderStatusLabel, OrderStatusEnum } from 'src/app/@core/models/order.model';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { EnumService } from 'src/app/@core/services/array-services/enum.service';
import { Paging } from 'src/app/@core/models/paging.model';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  _paging: Paging = new Paging();
  filter: filterOrder = {};
  statusList = EnumService.ParseEnumToArray(OrderStatusEnum);
  selectedStatus: any = '';
  searchCode = '';
  getOrderStatusLabel = getOrderStatusLabel;
  _currencyHelper = new CurrencyHelper();
  ratingTarget: Order | null = null;
  ratingValue: number = 5;
  ratingComment: string = '';
  isSubmittingRating = false;

  constructor(private _appServices: AppServices) { }

  ngOnInit(): void {
    this._paging.setPaging(1, 10, 0);
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    const params = {
      ...this.filter,
      status: this.selectedStatus || undefined,
      q: this.searchCode || undefined,
      ...this._paging.getPagingParams(),
      sort: 'newest'
    };

    this._appServices.OrderService.getOrders(params).subscribe({
      next: res => {
        this.orders = res.data?.orders || [];
        this._paging.setPaging(res.data?.pageIndex || 1, res.data?.pageSize || 10, res.data?.total || 0);
      },
      error: err => {
        console.error('Error loading orders:', err);
        this._appServices.NotificationService.createNotification('Không thể tải danh sách đơn hàng', NotificationStatus.ERROR);
      },
      complete: () => this.isLoading = false
    });
  }

  onFilterChange() {
    this._paging.setPageIndex(1);
    this.loadOrders();
  }

  onPageChange(e: { pageIndex: number, pageSize: number }) {
    this._paging.setPageIndex(e.pageIndex);
    this._paging.setPageSize(e.pageSize);
    this.loadOrders();
  }

  formatPrice(v: number) {
    return v?.toLocaleString('vi-VN') + ' ₫';
  }

  onImgError(event: any) {
    const fallback = 'assets/images/default-product.png';
    if (event?.target?.src !== fallback) {
      event.target.src = fallback;
    }
  }

  openRating(order: Order) {
    this.ratingTarget = order;
    this.ratingValue = 5;
    this.ratingComment = '';
  }

  submitRating() {
    if (!this.ratingTarget?._id) return;
    if (this.ratingValue < 1 || this.ratingValue > 5) {
      this._appServices.NotificationService.createNotification('Chọn điểm từ 1-5', NotificationStatus.ERROR);
      return;
    }
    this.isSubmittingRating = true;
    this._appServices.OrderService.createOrderFeedback(this.ratingTarget._id, {
      rating: this.ratingValue,
      comment: this.ratingComment
    }).subscribe({
      next: () => {
        this._appServices.NotificationService.createNotification('Gửi đánh giá thành công', NotificationStatus.SUCSSESS);
        this.ratingTarget = null;
        this.loadOrders();
      },
      error: err => {
        console.error(err);
        this._appServices.NotificationService.createNotification(err.error?.message || 'Không thể gửi đánh giá', NotificationStatus.ERROR);
      },
      complete: () => this.isSubmittingRating = false
    });
  }
}
