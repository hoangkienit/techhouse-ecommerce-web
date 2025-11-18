import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent {
  @Input() product: any;

  get formattedPrice(): string {
    return this.product?.price ? this.product.price.toLocaleString('vi-VN') + ' ₫' : '';
  }
}
