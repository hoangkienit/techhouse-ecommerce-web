import { Component } from '@angular/core';
import { Paging } from 'src/app/@core/models/paging.model';
import { OrderService } from 'src/app/@core/services/apis/order.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orders: any[] = [];
  _statusServiceTag = StatusServiceTag;
  _currencyHelper: any;
  isLoading: boolean = false;
  _paging: Paging = new Paging();
  filter: any = {};

  selectedCategory: any = '';
  selectedBrand: any = '';
  selectedStatus: any = '';
  selectedSort: any = '';
  selectedTimeFilter: string = '';
  searchName: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;

  params: any = null;
  selectedOrder: any = null;

  constructor(private _orderService: OrderService) { }

  ngOnInit() {
    this._paging.setPaging(1, 10, 0);
    this.params = this._paging.getPagingParams();
    this._currencyHelper = new CurrencyHelper();
    this.isLoading = true;
    this.loadOrders();
  }

  onFilterChange() {
    this.filter = {
      category: this.selectedCategory.toLowerCase(),
      brand: this.selectedBrand,
      sort: this.selectedSort,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      q: this.searchName || undefined,
      status: this.selectedStatus.toLowerCase() || undefined,
      time: this.selectedTimeFilter || undefined
    };

    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.params = {
      ...this.filter,
      ...this._paging.getPagingParams()
    };
    this._orderService.getAllOrders(this.params).subscribe({
      next: (res) => {
        this._paging.setPaging(res.data?.pagination?.pageIndex, res.data?.pagination?.pageSize, res.data?.pagination?.totalItems);
        this.orders = res.data?.orders || [];
      },
      error: (e) => {
        console.error('Error fetching orders:', e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  openOrderDetails(order: any) {
    this.selectedOrder = order;
  }

  openAddModalOrder() {
    // TODO: integrate modal to add order
    console.info('openAddModalOrder not implemented yet');
  }

  deleteOrder(order: any) {
    const orderId = order?._id || order?.id;
    if (!orderId) return;
    this.isLoading = true;
    this._orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (e) => {
        console.error('Error deleting order:', e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateOrderStatus(order: any, status: string = 'confirmed') {
    const orderId = order?._id || order?.id;
    if (!orderId) return;
    this.isLoading = true;
    this._orderService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        this.selectedOrder = res.data?.order || order;
        this.loadOrders();
      },
      error: (e) => {
        console.error('Error updating order status:', e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(e: { pageIndex: number, pageSize: number }) {
    this._paging.setPageIndex(e.pageIndex);
    this._paging.setPageSize(e.pageSize);
    this.loadOrders();
  }

  onMinInput(event: any) {
    const val = event.target.value;
    this._currencyHelper.setMinValue(val);
    this.minPrice = Number(this._currencyHelper.minValue.replace(/\./g, ''));
  }

  onMaxInput(event: any) {
    const val = event.target.value;
    this._currencyHelper.setMaxValue(val);
    this.maxPrice = Number(this._currencyHelper.maxValue.replace(/\./g, ''));
  }
}
