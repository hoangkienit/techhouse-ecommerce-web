import { AppServices } from 'src/app/@core/services/AppServices.service';
import { ActionHandleLoyalty, LoyaltyRank, LoyaltyRankLabel } from './../../../../../@core/enums/loyalties/loyalties.enum';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { StatusServiceTag } from 'src/app/@core/services-components/ngx-tag/ngx-tag.component';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { NbDialogRef } from '@nebular/theme';
import { getLoyaltyRank, getLoyaltyRankLabel, getRankColor, getRankIcon } from 'src/app/@core/models/loyalty.helper';

@Component({
  selector: 'app-update-loyalty-modal',
  templateUrl: './update-loyalty-modal.component.html',
  styleUrls: ['./update-loyalty-modal.component.scss']
})

export class UpdateLoyaltyModalComponent {
  action: string = 'add';
  amount: number = 0;
  @Input() user: any;
  currentLoyalty = 0; // truyền từ ngoài vào
  actionHandleLoyalty = ActionHandleLoyalty;
  isLoading = false;
  maximunBoardVal = 0;
  currentRank = LoyaltyRank.BRONZE;
  currentRankLabel = LoyaltyRankLabel.BRONZE;
  getRankColor = getRankColor;
  rankIcon = 'award-outline';

  constructor(private _appService: AppServices, public dialogRef: NbDialogRef<UpdateLoyaltyModalComponent>) { }

  ngOnInit() {
    this.currentLoyalty = this.user?.loyalty_points || 0;
    this.currentRank = getLoyaltyRank(this.currentLoyalty);
    this.currentRankLabel = getLoyaltyRankLabel(this.currentRank);
    this.rankIcon = getRankIcon(this.currentRank);
    this.initMax();
  }

  initMax() {
    const val = this.currentLoyalty;

    // lấy số chữ số của val → nâng lên thành 1, 10, 100, 1000...
    const power = Math.pow(10, Math.floor(Math.log10(val)));

    // nếu val nằm dưới 1.5 * power thì max = power
    // nếu không thì nhảy sang bậc tiếp theo cho rộng rãi
    this.maximunBoardVal = val <= power * 1.5
      ? power
      : power * 10;
  }

  handleAction() {
    switch (this.action) {
      case this.actionHandleLoyalty.DECREASE:
        this.currentLoyalty -= this.amount;
        if (this.currentLoyalty < 0) this.currentLoyalty = 0;
        break;
      case this.actionHandleLoyalty.INCREASE:
        this.currentLoyalty += this.amount;
        if (this.currentLoyalty < 0) this.currentLoyalty = 0;
        break;
      case this.actionHandleLoyalty.BONUS:
        this.currentLoyalty += 100;
        if (this.currentLoyalty < 0) this.currentLoyalty = 0;
        break;
      case this.actionHandleLoyalty.DOUBLE:
        this.currentLoyalty = this.currentLoyalty * 2;
        if (this.currentLoyalty < 0) this.currentLoyalty = 0;
        break;
      case this.actionHandleLoyalty.DEFAULT:
        this.currentLoyalty = this.amount;
        if (this.currentLoyalty < 0) this.currentLoyalty = 0;
        break;
      default:
        break;
    }
    this.currentRank = getLoyaltyRank(this.currentLoyalty);
    this.currentRankLabel = getLoyaltyRankLabel(this.currentRank);
    this.rankIcon = getRankIcon(this.currentRank);
    this.initMax();
  }

  confirmCheck() {
    this._appService.ModalService.createConfirmDialog(
      'Bạn có chắc muốn muốn cập nhật điểm mới cho tài khoản này không?',
      'Xác nhận',
      'Xác nhận',
      'Thoát',
      () => this.submit(),
      () => { }
    );
  }

  submit() {
    this.isLoading = true;
    this._appService.UserService.UpdateLoyaltyPoint(this.user._id, this.currentLoyalty).subscribe(
      {
        next: (res) => {
          this.isLoading = false;
          this._appService.NotificationService.createNotification("Cập nhật điểm thành công", NotificationStatus.SUCSSESS);
        },
        error: e => {
          this.isLoading = false;
          this._appService.NotificationService.createNotification("Có lỗi khi cập nhật điểm hội viên!!", NotificationStatus.ERROR)
        },
        complete: () => {
        }
      }
    )
  }
}


