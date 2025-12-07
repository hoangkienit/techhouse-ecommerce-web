import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/@core/services/apis/discount.service';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { AppServices } from 'src/app/@core/services/AppServices.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  discounts: any[] = [];
  isLoading = false;

  constructor(private discountService: DiscountService, private _appServices: AppServices) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.discountService.getPublicDiscounts().subscribe({
      next: res => {
        this.discounts = res.data?.discounts || [];
      },
      error: err => {
        console.error(err);
        this._appServices.NotificationService.createNotification('Không thể tải mã giảm giá', NotificationStatus.ERROR);
      },
      complete: () => this.isLoading = false
    });
  }
}
