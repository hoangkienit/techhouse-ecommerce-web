import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    // private baseUrl = apiUrl + 'user';
    private baseUrl = apiUrl_test + 'address';
    private credentials = { withCredentials: true };

    constructor(private http: HttpClient) { }

    GetAddressesByUser() {
        return this.http.get<any>(`${this.baseUrl}`, this.credentials);
    }

    GetAddressesByUserId(userId: any) {
        return this.http.get<any>(`${this.baseUrl}/${userId}`, this.credentials);
    }

    CreateAddress(payload: any) {
        return this.http.post<any>(`${this.baseUrl}`, payload, this.credentials);
    }

    UpdateAddress(addressId: string, payload: any) {
        return this.http.put<any>(`${this.baseUrl}/${addressId}`, payload, this.credentials);
    }

    DeleteAddress(addressId: string) {
        return this.http.delete<any>(`${this.baseUrl}/${addressId}`, this.credentials);
    }

    SetDefault(addressId: string) {
        return this.http.patch<any>(`${this.baseUrl}/${addressId}/default`, {}, this.credentials);
    }
}
