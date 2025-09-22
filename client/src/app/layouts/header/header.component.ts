import { Component } from '@angular/core';
import { NbPosition, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/@core/models/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  // @Input() userMenu: any[] = [];

  isLoading: boolean = false;
  position: NbPosition = NbPosition.BOTTOM_END;
  currentTheme = 'default';

  cartItems: Product[] = [];
  cartOpen: boolean = false;

  user = {
    name: 'Duy Quang',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010',
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
      { id: "001", name: 'Áo thun nam', price: 150000, image: '', category: 'Clothes' },
      { id: "002", name: 'Giày sneaker', price: 550000, image: '', category: 'Shoes' },
      { id: "003", name: 'Balo du lịch', price: 350000, image: '', category: 'Bags' },
      { id: "004", name: 'Đồng hồ thông minh', price: 1250000, image: '', category: 'Watches' },
      { id: "005", name: 'Mắt kính thời trang', price: 250000, image: '', category: 'Accessories' },
      { id: "006", name: 'Nước hoa cao cấp', price: 850000, image: '', category: 'Perfumes' },
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

  removeFromCart(item: any) {
    // this.cartItems = this.cartItems.filter(i => i !== item);
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
}
