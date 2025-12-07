import { Component } from '@angular/core';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  isLoading = false;
  cart: any = null;
  cartId: string | undefined;
  _currencyHelper = new CurrencyHelper();
  discountCode: string = '';
  updatingItem: string | null = null;

  constructor(private _appServices: AppServices) { }

  ngOnInit(): void {
    this.cartId = localStorage.getItem('guest_cart_id') || undefined;
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this._appServices.CartService.GetCart(this.cartId).subscribe({
      next: res => {
        this.handleCartResponse(res.data);
      },
      error: err => {
        console.error('Error loading cart:', err);
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('duplicate key')) {
          this.resetGuestCart();
          this.loadCart();
          return;
        }
        this.isLoading = false;
      }
    });
  }

  private handleCartResponse(data: any) {
    this.cart = data;
    this.cartId = data?.cartId || this.cartId;
    if (this.cartId) {
      localStorage.setItem('guest_cart_id', this.cartId);
    }
    this._appServices.GlobalStateService.setCart(data);
    this.isLoading = false;
  }

  private resetGuestCart() {
    localStorage.removeItem('guest_cart_id');
    this.cartId = undefined;
    this.cart = null;
  }

  removeItem(item: any) {
    this.updatingItem = item._id;
    this._appServices.CartService.RemoveItem(item._id, this.cartId).subscribe({
      next: res => this.handleCartResponse(res.data),
      error: err => {
        console.error('Remove item failed:', err);
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('duplicate key')) {
          this.resetGuestCart();
          this.loadCart();
          return;
        }
        this.updatingItem = null;
      },
      complete: () => this.updatingItem = null
    });
  }

  changeQty(item: any, delta: number) {
    const newQty = (item.quantity || 0) + delta;
    if (newQty < 0) return;
    this.updateQty(item, newQty);
  }

  updateQty(item: any, quantity: number) {
    if (quantity < 0) return;
    this.updatingItem = item._id;
    this._appServices.CartService.UpdateQuantity(item._id, quantity, this.cartId).subscribe({
      next: res => this.handleCartResponse(res.data),
      error: err => {
        console.error('Update qty failed:', err);
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('duplicate key')) {
          this.resetGuestCart();
          this.loadCart();
          return;
        }
        this.updatingItem = null;
      },
      complete: () => this.updatingItem = null
    });
  }

  applyDiscount() {
    if (!this.discountCode?.trim()) return;
    this.isLoading = true;
    this._appServices.CartService.ApplyDiscount(this.discountCode.trim(), this.cartId).subscribe({
      next: res => {
        this.handleCartResponse(res.data);
        this._appServices.NotificationService.createNotification('Áp dụng mã giảm giá thành công', NotificationStatus.SUCSSESS);
      },
      error: err => {
        console.error('Apply discount failed:', err);
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('duplicate key')) {
          this.resetGuestCart();
          this.loadCart();
          return;
        }
        this._appServices.NotificationService.createNotification('Mã giảm giá không hợp lệ', NotificationStatus.ERROR);
        this.isLoading = false;
      }
    });
  }

  removeDiscount() {
    this.isLoading = true;
    this._appServices.CartService.RemoveDiscount(this.cartId).subscribe({
      next: res => {
        this.discountCode = '';
        this.handleCartResponse(res.data);
      },
      error: err => {
        console.error('Remove discount failed:', err);
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('duplicate key')) {
          this.resetGuestCart();
          this.loadCart();
          return;
        }
        this.isLoading = false;
      }
    });
  }

  formatPrice(value: number) {
    return value?.toLocaleString('vi-VN') + ' ₫';
  }

  onImgError(event: any) {
    const defaultImg = 'assets/images/default-product.png';
    if (event?.target?.src !== defaultImg) {
      event.target.src = defaultImg;
    }
  }
}
