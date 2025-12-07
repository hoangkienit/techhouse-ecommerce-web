import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { AppServices } from './@core/services/AppServices.service';
import { Subscription } from 'rxjs';
import { NbMenuItem } from '@nebular/theme';
import { UserRoles } from './@core/constants/role.constant';

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
  checkLogin = false;

  constructor(
    private appServices: AppServices,
    private sidebarService: NbSidebarService,
  ) { }

  ngOnInit() {
    this.buildMenu();

    this.appServices.GlobalStateService.currentUser$.subscribe(() => {
      this.buildMenu();
      this.checkLogin = true
    });
  }

  ngOnDestroy() {
  }

  buildMenu() {
    const roleUser = this.appServices.GlobalStateService.currentUser?.role;

    this.appServices.TranslateService.get([
      'sideBar.home', 'sideBar.catalog', 'sideBar.products', 'sideBar.categories', 'sideBar.brands',
      'sideBar.cart', 'sideBar.orders', 'sideBar.loyalty', 'sideBar.discount',
      'sideBar.auth', 'sideBar.login', 'sideBar.register', 'sideBar.profile', 'sideBar.logout',
      'sideBar.admin', 'sideBar.users', 'sideBar.dashboard'
    ]).subscribe(trans => {

      const items: NbMenuItem[] = [
        { title: trans['sideBar.home'], icon: 'home-outline', link: '/home' },

        // Catalog menu
        {
          title: trans['sideBar.catalog'], icon: 'shopping-bag-outline', children: [
            { title: trans['sideBar.products'], icon: 'cube-outline', link: '/catalog/products' },
            { title: trans['sideBar.categories'], icon: 'grid-outline', link: '/catalog/categories' },
            { title: trans['sideBar.brands'], icon: 'pricetags-outline', link: '/catalog/brands' },
          ]
        },

        { title: trans['sideBar.cart'], icon: 'shopping-cart-outline', link: '/cart' },
        { title: trans['sideBar.orders'], icon: 'list-outline', link: '/orders' },
        { title: trans['sideBar.loyalty'], icon: 'award-outline', link: '/loyalty' },
        { title: trans['sideBar.discount'], icon: 'percent-outline', link: '/discount' },
      ];

      // Account menu
      let accountMenu: any | null = null;
      const user = this.appServices.GlobalStateService.currentUser;
      if (!user) {
        // Chưa login
        accountMenu = {
          title: trans['sideBar.account'], icon: 'person-outline', children: [
            { title: trans['sideBar.login'], icon: 'person-outline', link: '/account/auth/login' },
            { title: trans['sideBar.register'], icon: 'person-add-outline', link: '/account/auth/register' },
          ]
        };
      } else if (roleUser !== 'admin' && roleUser !== 'manager') {
        // User thường
        accountMenu = {
          title: trans['sideBar.account'], icon: 'person-outline', children: [
            { title: trans['sideBar.profile'], icon: 'person-done-outline', link: '/account/profile' },
            { title: trans['sideBar.logout'], icon: 'log-out-outline', link: '/account/logout' },
          ]
        };
      }
      if (accountMenu) {
        items.push(accountMenu);
      }

      // Admin menu (nếu role phù hợp)
      if (roleUser === 'admin' || roleUser === 'manager') {
        items.push({
          title: trans['sideBar.admin'], icon: 'settings-2-outline', children: [
            { title: trans['sideBar.dashboard'], icon: 'pie-chart-outline', link: '/admin/dashboard' },
            { title: trans['sideBar.users'], icon: 'people-outline', link: '/admin/users', hidden: roleUser !== 'admin' },
            { title: trans['sideBar.products'], icon: 'cube-outline', link: '/admin/products' },
            { title: trans['sideBar.orders'], icon: 'clipboard-outline', link: '/admin/orders' },
            { title: trans['sideBar.discount'], icon: 'pricetags-outline', link: '/admin/discounts', hidden: roleUser !== 'admin' },
            { title: trans['sideBar.logout'], icon: 'log-out-outline', link: '/account/logout' },
          ]
        });
      }

      this.menuItems = items;
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
