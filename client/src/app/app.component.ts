import { AppServices } from './@core/services/AppServices.service';
import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UIWeb';
  isExpanded = true;

  menuItems = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home'
    },
    {
      title: 'Catalog',
      icon: 'shopping-bag-outline',
      children: [
        {
          title: 'All Products',
          link: '/catalog/products',
        },
        {
          title: 'Categories',
          link: '/catalog/categories',
        },
        {
          title: 'Brands',
          link: '/catalog/brands',
        },
      ],
    },
    {
      title: 'Cart',
      icon: 'shopping-cart-outline',
      link: '/cart'
    },
    {
      title: 'Orders',
      icon: 'list-outline',
      link: '/orders'
    },
    {
      title: 'Account',
      icon: 'person-outline',
      children: [
        {
          title: 'Login',
          link: '/auth/login',
        },
        {
          title: 'Register',
          link: '/auth/register',
        },
        {
          title: 'Profile',
          link: '/auth/profile',
        },
        {
          title: 'Logout',
          link: '/auth/logout',
        },
      ],
    },
    {
      title: 'Admin',
      icon: 'settings-2-outline',
      children: [
        {
          title: 'Manage Users',
          link: '/admin/users',
        },
        {
          title: 'Manage Products',
          link: '/admin/products',
        },
        {
          title: 'Manage Orders',
          link: '/admin/orders',
        },
      ],
    },
  ];

  constructor(private appServices: AppServices, private sidebarService: NbSidebarService) { }

  switchLang(lang: string) {
    this.appServices.TranslateService.useLanguage(lang);
  }


  toggleSidebar(): void {
    this.sidebarService.toggle(true, 'menu-sidebar'); // true = có animation
    this.isExpanded = !this.isExpanded;
  }
}
