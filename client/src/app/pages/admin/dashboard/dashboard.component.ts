import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { OrderService } from 'src/app/@core/services/apis/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboard: any = {};
  revenue: any = {};
  topProducts: any[] = [];
  topCustomers: any[] = [];
  paymentMethods: any[] = [];
  statusCounts: { label: string; value: number }[] = [];

  isLoadingDashboard = false;
  isLoadingRevenue = false;
  isLoadingTopProducts = false;
  isLoadingTopCustomers = false;
  isLoadingPaymentMethods = false;

  statusChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  statusChartOptions: ChartOptions<'doughnut'> = {};

  paymentChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  paymentChartOptions: ChartOptions<'pie'> = {};

  private subs = new Subscription();

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRevenue();
    this.loadTopProducts();
    this.loadTopCustomers();
    this.loadPaymentMethods();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadDashboard(): void {
    this.isLoadingDashboard = true;
    this.subs.add(
      this.orderService.getDashboard().subscribe(res => {
        const counts = res.data?.statusCounts || {};
        this.dashboard = res.data || {};
        this.statusCounts = Object.keys(counts).map(k => ({ label: k, value: counts[k] }));

        this.statusChartData = {
          labels: Object.keys(counts),
          datasets: [{
            data: Object.values(counts),
            backgroundColor: ['#4dabf7', '#ff922b', '#69db7c', '#f03e3e', '#fcc2d7'],
            borderColor: '#fff',
            borderWidth: 2
          }]
        };

        this.statusChartOptions = {
          responsive: true,
          cutout: '50%',
          plugins: {
            legend: { position: 'bottom', display: false },
            tooltip: { enabled: true }
          }
        };

        this.isLoadingDashboard = false;
      }, () => this.isLoadingDashboard = false)
    );
  }

  loadRevenue(): void {
    this.isLoadingRevenue = true;
    this.subs.add(
      this.orderService.getRevenueBoard().subscribe(res => {
        this.revenue = res.data || {};
        this.isLoadingRevenue = false;
      }, () => this.isLoadingRevenue = false)
    );
  }

  loadTopProducts(): void {
    this.isLoadingTopProducts = true;
    this.subs.add(
      this.orderService.getTopProductsBoard().subscribe(res => {
        this.topProducts = res.data || [];
        this.isLoadingTopProducts = false;
      }, () => this.isLoadingTopProducts = false)
    );
  }

  loadTopCustomers(): void {
    this.isLoadingTopCustomers = true;
    this.subs.add(
      this.orderService.getCustomerBoard().subscribe(res => {
        this.topCustomers = res.data || [];
        this.isLoadingTopCustomers = false;
      }, () => this.isLoadingTopCustomers = false)
    );
  }

  loadPaymentMethods(): void {
    this.isLoadingPaymentMethods = true;
    this.subs.add(
      this.orderService.getPaymentMethodBoard().subscribe(res => {
        const methods = res.data || [];
        this.paymentMethods = methods;

        this.paymentChartData = {
          labels: methods.map((m: any) => m._id?.toUpperCase() || 'Unknown'),
          datasets: [{
            data: methods.map((m: any) => m.totalRevenue || 0),
            backgroundColor: ['#74c0fc', '#ffa94d', '#63e6be', '#f783ac', '#ffd43b'],
            borderColor: '#fff',
            borderWidth: 2
          }]
        };

        this.paymentChartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
              labels: { color: '#555', font: { size: 14 } }
            },
            tooltip: {
              enabled: true,
              backgroundColor: '#333',
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          }
        };

        this.isLoadingPaymentMethods = false;
      }, () => this.isLoadingPaymentMethods = false)
    );
  }
}
