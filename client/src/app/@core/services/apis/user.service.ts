import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // private baseUrl = apiUrl + 'user';
    private baseUrl = apiUrl_test + 'user';
    private credentials = { withCredentials: true };

    constructor(private http: HttpClient) { }

    GetAllUsers(params: any) {
        return this.http.get<any>(`${this.baseUrl}/list`, { params: buildHttpParams(params), ...this.credentials });
    }

    GetUserById(userId: string) {
        return this.http.get<{}>(`${this.baseUrl}/${userId}`, this.credentials);
    }

    UpdateLoyaltyPoint(userId: string, point: number) {
        return this.http.put<{}>(`${this.baseUrl}/loyalty-points/${userId}`, { point }, this.credentials);
    }
    // UpdateUserById(userId: string, params: any) {
    //     return this.http.post<{}>(`${this.baseUrl}/${userId}`, params, this.credentials);
    // }

    // DeleteUserById(userId: string) {
    //     return this.http.delete<{}>(`${this.baseUrl}/${userId}`, this.credentials);
    // }

    BandUserById(params: any) {
        return this.http.patch<{}>(`${this.baseUrl}/set-status/${params.userId}`, { status: params.status }, this.credentials)
    }
}
