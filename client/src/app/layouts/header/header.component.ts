import { Component } from '@angular/core';
import { NbPosition, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/@core/models/auth.model';
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

  user = {
    name: "Guest",
    avatar: '',
  };

  constructor(private themeService: NbThemeService, private translate: TranslateService, private _appservices: AppServices) { }

  ngOnInit() {
    this._appservices.GlobalStateService.currentUser$.subscribe(user => {
      this.user = {
        name: user?.fullname || 'Guest',
        avatar: user?.profileImg || ''
      };
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
    this.themeService.changeTheme(this.currentTheme);
  }
}
