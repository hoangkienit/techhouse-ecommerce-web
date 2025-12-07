import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/apis/auth.service';
import { GlobalStateService } from 'src/app/@core/services/GlobalStateService.service';

@Component({
  selector: 'app-logout',
  template: `<p>Logging out...</p>`,
  styleUrls: []
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private globalState: GlobalStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Xóa token/cookie
    this.authService.Logout().subscribe(() => {
      this.globalState.clearUser();
      document.cookie = 'currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Redirect về login
      this.router.navigate(['/account/auth/login']);
    })
  }
}