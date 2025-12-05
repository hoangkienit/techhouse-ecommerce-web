import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  baseAmount = 12000000;
  taxRate = 0.1;
  shippingInfo = { name: '', address: '', phone: '' };
  paymentMethod = 'credit-card';
  discountCode = '';
  discountApplied = false;
  discountAmount = 0;
  shippingFee = 200000;
  taxAmount = this.baseAmount * this.taxRate;
  totalAmount = this.calculateTotal();

  applyDiscount() {
    if (this.discountCode === 'DISCOUNT50') {
      this.discountAmount = 500000;
      this.discountApplied = true;
      this.totalAmount = this.calculateTotal();
    }
  }

  private calculateTotal(): number {
    return this.baseAmount + this.taxAmount + this.shippingFee - this.discountAmount;
  }

  placeOrder() {
    alert('Order placed successfully!');
    // Implement order submission logic here
  }
}
