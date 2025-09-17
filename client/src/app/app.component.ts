import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { AppServices } from './@core/services/AppServices.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'UIWeb';
  isExpanded = true;
  menuItems: any[] = [];
  isLoading = true;

  constructor(
    private appServices: AppServices,
    private sidebarService: NbSidebarService,
  ) { }

  ngOnInit() {
    this.buildMenu();
  }

  ngOnDestroy() {
  }

  buildMenu() {
    this.appServices.TranslateService.get([
      'sideBar.home',
      'sideBar.catalog',
      'sideBar.products',
      'sideBar.categories',
      'sideBar.brands',
      'sideBar.cart',
      'sideBar.orders',
      'sideBar.auth',
      'sideBar.login',
      'sideBar.register',
      'sideBar.profile',
      'sideBar.logout',
      'sideBar.admin',
      'sideBar.users'
    ]).subscribe((trans: any) => {
      this.menuItems = [
        {
          title: this.appServices.TranslateService.instant('sideBar.home'),
          icon: 'home-outline',
          link: '/home'
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.catalog'),
          icon: 'shopping-bag-outline',
          children: [
            { title: this.appServices.TranslateService.instant('sideBar.products'), icon: 'cube-outline', link: '/catalog/products' },
            { title: this.appServices.TranslateService.instant('sideBar.categories'), icon: 'grid-outline', link: '/catalog/categories' },
            { title: this.appServices.TranslateService.instant('sideBar.brands'), icon: 'pricetags-outline', link: '/catalog/brands' },
          ],
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.cart'),
          icon: 'shopping-cart-outline',
          link: '/cart'
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.orders'),
          icon: 'list-outline',
          link: '/orders'
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.loyalty'),
          icon: 'award-outline',
          link: '/loyalty'
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.discount'),
          icon: 'percent-outline',
          link: '/discount'
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.account'),
          icon: 'person-outline',
          children: [
            { title: this.appServices.TranslateService.instant('sideBar.auth'), icon: 'person-add-outline', link: '/account/auth' },
            { title: this.appServices.TranslateService.instant('sideBar.profile'), icon: 'person-done-outline', link: '/account/profile' },
            { title: this.appServices.TranslateService.instant('sideBar.logout'), icon: 'log-out-outline', link: '/account/logout' },
          ],
        },
        {
          title: this.appServices.TranslateService.instant('sideBar.admin'),
          icon: 'settings-2-outline',
          children: [
            { title: this.appServices.TranslateService.instant('sideBar.dashboard'), icon: 'pie-chart-outline', link: '/admin/dashboard' },
            { title: this.appServices.TranslateService.instant('sideBar.users'), icon: 'people-outline', link: '/admin/users' },
            { title: this.appServices.TranslateService.instant('sideBar.products'), icon: 'cube-outline', link: '/admin/products' },
            { title: this.appServices.TranslateService.instant('sideBar.orders'), icon: 'clipboard-outline', link: '/admin/orders' },
            { title: this.appServices.TranslateService.instant('sideBar.discount'), icon: 'pricetags-outline', link: '/admin/discounts' },
          ],
        },
      ];


      this.isLoading = false;
    });
  }

  switchLang(lang: string) {
    this.appServices.TranslateService.useLanguage(lang);
  }

  toggleSidebar(): void {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.isExpanded = !this.isExpanded;
  }
}
