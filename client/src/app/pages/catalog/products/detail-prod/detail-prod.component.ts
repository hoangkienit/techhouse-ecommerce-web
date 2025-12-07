import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AppServices } from 'src/app/@core/services/AppServices.service';
import { CurrencyHelper } from 'src/app/@core/services/currency/currency.helper';

@Component({
  selector: 'app-detail-prod',
  templateUrl: './detail-prod.component.html',
  styleUrls: ['./detail-prod.component.scss']
})
export class DetailProdComponent implements OnInit {
  isLoading = false;
  productId = '';
  product: any = null;
  _currencyHelper: any;
  currentImg = 0; // slide show hiện tại
  cartId: string | undefined;
  private retryAddOnce = false;

  constructor(
    private _appServices: AppServices,
    private routerActivated: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
    this._currencyHelper = new CurrencyHelper();
    this.cartId = localStorage.getItem('guest_cart_id') || undefined;

    this.routerActivated.queryParams.subscribe(params => {
      if (params['productId']) {
        this.productId = params['productId'];
        this.loadProductDetail();
      } else {
        this.back();
      }
    });
  }

  loadProductDetail(): void {
    this.isLoading = true;
    this._appServices.ProductService.getProductsById(this.productId).subscribe({
      next: res => {
        this.product = res?.data?.product;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching product detail:', err);
        this.isLoading = false;
      }
    });
  }

  formatPrice(value: number): string {
    return value?.toLocaleString('vi-VN') + ' ₫';
  }

  // Slide show
  prevImg(): void {
    if (!this.product?.product_imgs) return;
    this.currentImg = (this.currentImg - 1 + this.product.product_imgs.length) % this.product.product_imgs.length;
  }

  nextImg(): void {
    if (!this.product?.product_imgs) return;
    this.currentImg = (this.currentImg + 1) % this.product.product_imgs.length;
  }

  back(): void {
    this.router.navigate(['/catalog/products']);
  }

  onImgError(event: any) {
    const defaultImg = 'assets/images/default-product.png';
    if (event.target.src !== defaultImg) {
      event.target.src = defaultImg;
    }
  }

  quantity: number = 1;

  increaseQty() {
    if (this.quantity < this.product.product_stock) {
      this.quantity++;
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    const cartId = localStorage.getItem('guest_cart_id') || undefined;
    this.isLoading = true;
    this._appServices.CartService.AddToCart(this.product._id, this.quantity, cartId).subscribe({
      next: res => {
        this._appServices.GlobalStateService.setCart(res.data);
        if (res.data?.cartId) {
          localStorage.setItem('guest_cart_id', res.data.cartId);
          this.cartId = res.data.cartId;
        }
        this.toastrService.success(`Đã thêm ${this.quantity} sản phẩm vào giỏ`, 'Thành công');
        this.retryAddOnce = false;
      },
      error: err => {
        const msg = err?.error?.message || '';
        if (msg.toLowerCase().includes('duplicate key') && !this.retryAddOnce) {
          // stale guest cart id, reset and retry once
          localStorage.removeItem('guest_cart_id');
          this.cartId = undefined;
          this.retryAddOnce = true;
          this.addToCart();
          return;
        }
        console.error('Error add to cart:', err);
        this.toastrService.danger('Không thể thêm vào giỏ', 'Lỗi');
      },
      complete: () => {
        this.isLoading = false;
      }
    });

  }
}
