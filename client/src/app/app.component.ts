import { Component, ViewChild } from '@angular/core';
import { TranslationService } from './@core/services/translate.service';
import { NbSidebarComponent, NbSidebarService } from '@nebular/theme';

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
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard'
    },
    {
      title: 'Users',
      icon: 'people-outline',
      link: '/users'
    },
    {
      title: 'Settings',
      icon: 'settings-2-outline',
      link: '/settings'
    }
  ];

  constructor(private translation: TranslationService, private sidebarService: NbSidebarService) { }

  switchLang(lang: string) {
    this.translation.useLanguage(lang);
  }


  toggleSidebar(): void {
    this.sidebarService.toggle(true, 'menu-sidebar'); // true = có animation
    this.isExpanded = !this.isExpanded;
  }
}
