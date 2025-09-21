import { Component } from '@angular/core';
import { NbPosition, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLoading: boolean = false;
  position: NbPosition = NbPosition.BOTTOM_END;
  currentTheme = 'default';

  cartItems: any[] = [];
  cartOpen: boolean = false;

  user = {
    name: 'Duy Quang',
    avatar: 'assets/avatar.png',
  };

  // Menu ngôn ngữ
  languages = [
    { title: '🇻🇳 Tiếng Việt', data: 'vi' },
    { title: '🇺🇸 English', data: 'en' },
  ];

  currentLang = 'vi';

  constructor(private themeService: NbThemeService, private translate: TranslateService) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadData();
  }

  loadData() {
    this.cartItems = [
      { name: 'Áo thun nam', price: 150000, image: 'https://via.placeholder.com/60' },
      { name: 'Giày sneaker', price: 550000, image: 'https://via.placeholder.com/60' },
      { name: 'Balo du lịch', price: 350000, image: 'https://via.placeholder.com/60' },
    ];
    this.isLoading = false;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
    this.themeService.changeTheme(this.currentTheme);
  }

  switchLang(langCode: string) {
    this.currentLang = langCode;
    this.translate.use(langCode);
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  goToCart() {

  }
}
