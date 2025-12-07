import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // private baseUrl = apiUrl + 'user';
    private baseUrl = apiUrl_test + 'cart';
    private credentials = { withCredentials: true };

    constructor(private http: HttpClient) { }

    GetCart() {
        return this.http.get<any>(`${this.baseUrl}/`, this.credentials);
    }
}
