import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems = [
    { productName: 'Laptop', productImg: 'path/to/img.jpg', price: 10000000, quantity: 1 },
    { productName: 'Smartphone', productImg: 'path/to/img.jpg', price: 7000000, quantity: 2 },
  ];
  totalPrice = 0;
  taxAmount = 0;
  shippingFee = 200000;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.taxAmount = this.totalPrice * 0.1;  
  }

  formatPrice(price: number): string {
    return price.toLocaleString();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
