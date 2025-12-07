import { Component, OnInit } from '@angular/core';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {
  points = 0;
  isLoading = false;
  error: string | null = null;

  constructor(private _appServices: AppServices) { }

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints() {
    this.isLoading = true;
    this._appServices.UserService.GetLoyaltyPoints().subscribe({
      next: res => {
        this.points = Number(res.data?.points ?? 0);
        this.error = null;
      },
      error: err => {
        console.error('Load loyalty points failed:', err);
        this.error = err.error?.message || 'Không thể tải điểm tích luỹ';
        this._appServices.NotificationService.createNotification(this.error || 'Không thể tải điểm tích luỹ', NotificationStatus.ERROR);
        this.isLoading = false
      },
      complete: () => this.isLoading = false
    });
  }

  get equivalentMoney(): string {
    return (this.points * 1000).toLocaleString('vi-VN') + ' ₫';
  }
}
