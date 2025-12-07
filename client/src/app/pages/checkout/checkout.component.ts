import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NotificationStatus } from 'src/app/@core/enums/status.enum';
import { AppServices } from 'src/app/@core/services/AppServices.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: any = null;
  cartId: string | undefined;
  isLoading = false;
  orderResult: any = null;

  shippingForm!: FormGroup;
  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private _appServices: AppServices) { }

  ngOnInit(): void {
    this.cartId = localStorage.getItem('guest_cart_id') || undefined;
    this.buildForms();
    this.loadCart();
  }

  private buildForms() {
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      state: [''],
      postalCode: [''],
      country: ['Vietnam', Validators.required],
      saveAsNew: [false],
      setAsDefault: [false],
    });

    this.paymentForm = this.fb.group({
      type: ['cod', Validators.required],
      provider: [''],
      note: [''],
      points: [0]
    });
  }

  loadCart() {
    this.isLoading = true;
    this._appServices.CartService.GetCart(this.cartId).subscribe({
      next: res => this.handleCartResponse(res.data),
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

  private handleCartResponse(data: any, redirectIfEmpty: boolean = true) {
    this.cart = data;
    this.cartId = data?.cartId || this.cartId;
    if (this.cartId) localStorage.setItem('guest_cart_id', this.cartId);
    this._appServices.GlobalStateService.setCart(data);

    // Prefill shipping form if available
    if (data?.shippingAddress) {
      const ship = data.shippingAddress;
      this.shippingForm.patchValue({
        fullName: ship.fullName || '',
        phone: ship.phone || '',
        line1: ship.line1 || '',
        line2: ship.line2 || '',
        city: ship.city || '',
        state: ship.state || '',
        postalCode: ship.postalCode || '',
        country: ship.country || 'Vietnam',
      });
    }

    if (redirectIfEmpty && !data?.items?.length) {
      this._appServices.NotificationService.createNotification('Giỏ hàng trống, vui lòng chọn sản phẩm', NotificationStatus.ERROR);
      this.router.navigate(['/cart']);
    }

    this.isLoading = false;
  }

  private resetGuestCart() {
    localStorage.removeItem('guest_cart_id');
    this.cartId = undefined;
    this.cart = null;
  }

  formatPrice(value: number) {
    return value?.toLocaleString('vi-VN') + ' ₫';
  }

  placeOrder() {
    if (this.shippingForm.invalid || this.paymentForm.invalid) {
      this.shippingForm.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (!this.cart?.items?.length) {
      this._appServices.NotificationService.createNotification('Giỏ hàng trống', NotificationStatus.ERROR);
      return;
    }

    const s = this.shippingForm.value;
    const p = this.paymentForm.value;

    const shippingPayload = {
      shippingAddress: {
        fullName: s.fullName,
        line1: s.line1,
        line2: s.line2,
        city: s.city,
        state: s.state,
        postalCode: s.postalCode,
        country: s.country,
        phone: s.phone,
      },
      contactEmail: s.email,
      shippingName: s.fullName,
      saveAsNew: s.saveAsNew,
      setAsDefault: s.setAsDefault,
      cartId: this.cartId,
    };

    const paymentPayload = {
      type: p.type,
      provider: p.provider,
      note: p.note,
    };

    this.isLoading = true;

    this._appServices.CartService.SetShipping(shippingPayload, this.cartId)
      .pipe(
        switchMap(() => this._appServices.CartService.SetPayment(paymentPayload, this.cartId)),
        switchMap(() => this._appServices.CartService.ConfirmCheckout(p.points || 0, this.cartId))
      )
      .subscribe({
        next: res => {
          this.orderResult = res.data?.order;
          this.handleCartResponse(res.data?.cart, false);
          this._appServices.NotificationService.createNotification('Đặt hàng thành công', NotificationStatus.SUCSSESS);
        },
        error: err => {
          console.error('Checkout error:', err);
          this._appServices.NotificationService.createNotification(err.error?.message || 'Không thể hoàn tất đặt hàng', NotificationStatus.ERROR);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
