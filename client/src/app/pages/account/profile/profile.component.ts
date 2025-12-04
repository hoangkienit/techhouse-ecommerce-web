import { Component, OnInit } from '@angular/core';
import { UserDtoRequest } from 'src/app/@core/models/auth.model';
import { GlobalStateService } from 'src/app/@core/services/GlobalStateService.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  user: UserDtoRequest | null = null;

  constructor(private appServices: GlobalStateService) { }

  ngOnInit(): void {
    this.user = this.appServices.currentUser;
  }
}
