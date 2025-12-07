import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { OrderService } from 'src/app/@core/services/apis/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboard: any = {};
  revenue: any = {};
  topProducts: any[] = [];
  topCustomers: any[] = [];
  paymentMethods: any[] = [];

  subs = new Subscription();

  // Chart data
  statusChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [],label: 'Order Status' }] };
  paymentChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRevenue();
    this.loadTopProducts();
    this.loadTopCustomers();
    this.loadPaymentMethods();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadDashboard() {
    this.subs.add(this.orderService.getDashboard().subscribe(res => {
      this.dashboard = res.data;
      this.statusChartData.labels = Object.keys(res.data.statusCounts);
      this.statusChartData.datasets[0].data = Object.values(res.data.statusCounts);
    }))
  }

  loadRevenue() {
    this.subs.add(this.orderService.getRevenueBoard().subscribe(res => this.revenue = res.data))
  }

  loadTopProducts() {
    this.subs.add(this.orderService.getTopProductsBoard().subscribe(res => this.topProducts = res.data))
  }

  loadTopCustomers() {
    this.subs.add(this.orderService.getCustomerBoard().subscribe(res => this.topCustomers = res.data))
  }

  loadPaymentMethods() {
    this.subs.add(this.orderService.getPaymentMethodBoard().subscribe(res => {
      this.paymentMethods = res.data;
      this.paymentChartData.labels = res.data.map((x: any) => x._id);
      this.paymentChartData.datasets[0].data = res.data.map((x: any) => x.totalRevenue);
    }))
  }
}
