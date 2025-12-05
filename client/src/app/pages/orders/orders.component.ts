import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/@core/services/apis/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  categories: string[] = ['All', 'Electronics', 'Accessories'];
  isLoading = false;
  selectedOrder: any = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders({ status: 'Confirmed' }).subscribe({
      next: (response) => {
        const ordersData = response?.data?.orders ?? response?.data ?? [];
        this.orders = Array.isArray(ordersData) ? ordersData : [];
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  updateStatus(orderId: string, status: string): void {
    if (!orderId) {
      return;
    }
    this.isLoading = true;
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (!orderId) {
      return;
    }
    this.isLoading = true;
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error deleting order:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
