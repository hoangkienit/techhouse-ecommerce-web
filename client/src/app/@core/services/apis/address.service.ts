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

    GetAddressesByUser(params: any) {
        return this.http.post<any>(`${this.baseUrl}`, params, this.credentials);
    }

    GetAddressesByUserId(userId: any) {
        return this.http.get<any>(`${this.baseUrl}/${userId}`, this.credentials);
    }
}
