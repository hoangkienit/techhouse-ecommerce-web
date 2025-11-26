import { Component, OnInit } from '@angular/core';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { Router } from '@angular/router';
import { GlobalStateService } from 'src/app/@core/services/GlobalStateService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;  

  constructor(private appServices: GlobalStateService) { }

  ngOnInit(): void {
    this.appServices.currentUser$.subscribe(user => {
      this.user = user;
      console.log("HỒ SƠ NGƯỜI DÙNG:", this.user);
    });
  }

  goToEdit() {
    console.log('Chỉnh sửa hồ sơ!');
  }
}
