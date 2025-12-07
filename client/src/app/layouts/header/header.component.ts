import { Component } from '@angular/core';
import { NbPosition, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { AppServices } from 'src/app/@core/services/AppServices.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLoading: boolean = false;
  position: NbPosition = NbPosition.BOTTOM_END;
  currentTheme = 'default';

  userFullDetails = this._appservices.GlobalStateService.currentUser;
  cartCount = 0;
  user = {
    name: "Guest",
    avatar: 'assets/images/default-user.jpg',
  };

  constructor(private themeService: NbThemeService, private translate: TranslateService, private _appservices: AppServices) { }

  ngOnInit() {
    this._appservices.GlobalStateService.currentUser$.subscribe(user => {
      this.user = {
        name: user?.fullname || 'Guest',
        avatar: user?.profileImg || 'assets/images/default-user.jpg'
      };
    });

    this._appservices.CartService.GetCart().subscribe({
      next: res => {
        console.log(res);
        if (res) {
          this._appservices.GlobalStateService.setCart(res.data);
          this.cartCount = res.data.items.length;
        }
      },
      complete: () => {
      }
    })
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
    this.themeService.changeTheme(this.currentTheme);
  }
}
