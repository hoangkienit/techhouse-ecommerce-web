import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // private baseUrl = apiUrl + 'cart';
    private baseUrl = apiUrl_test + 'cart';
    private credentials = { withCredentials: true };

    constructor(private http: HttpClient) { }

    private buildOptions(cartId?: string) {
        const headers: any = {};
        if (cartId) headers['x-cart-id'] = cartId;
        return { ...this.credentials, headers };
    }

    GetCart(cartId?: string) {
        return this.http.get<any>(`${this.baseUrl}/`, this.buildOptions(cartId));
    }

    AddToCart(productId: string, quantity: number = 1, cartId?: string) {
        return this.http.post<any>(`${this.baseUrl}/items`, { productId, quantity, cartId }, this.buildOptions(cartId));
    }

    UpdateQuantity(itemId: string, quantity: number, cartId?: string) {
        return this.http.patch<any>(`${this.baseUrl}/items/${itemId}`, { quantity, cartId }, this.buildOptions(cartId));
    }

    RemoveItem(itemId: string, cartId?: string) {
        return this.http.delete<any>(`${this.baseUrl}/items/${itemId}`, this.buildOptions(cartId));
    }

    ApplyDiscount(code: string, cartId?: string) {
        return this.http.post<any>(`${this.baseUrl}/discount/apply`, { code, cartId }, this.buildOptions(cartId));
    }

    RemoveDiscount(cartId?: string) {
        return this.http.delete<any>(`${this.baseUrl}/discount/remove`, this.buildOptions(cartId));
    }

    SetShipping(payload: {
        shippingAddress?: any,
        contactEmail?: string,
        shippingName?: string,
        addressId?: string,
        saveAsNew?: boolean,
        setAsDefault?: boolean,
        cartId?: string
    }, cartId?: string) {
        return this.http.post<any>(`${this.baseUrl}/checkout/shipping`, payload, this.buildOptions(cartId || payload.cartId));
    }

    SetPayment(paymentMethod: any, cartId?: string) {
        return this.http.post<any>(`${this.baseUrl}/checkout/payment`, { paymentMethod }, this.buildOptions(cartId));
    }

    ConfirmCheckout(points: number = 0, cartId?: string) {
        return this.http.post<any>(`${this.baseUrl}/checkout/confirm`, { points, cartId }, this.buildOptions(cartId));
    }
}
