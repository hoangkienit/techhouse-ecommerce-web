import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // private baseUrl = apiUrl + 'user';
    private baseUrl = apiUrl_test + 'user';
    private credentials = { withCredentials: true };

    constructor(private http: HttpClient) { }

    GetAllUsers() {
        return this.http.get<any>(`${this.baseUrl}/list`, this.credentials);
    }

    GetUserById(userId: string) {
        return this.http.get<{}>(`${this.baseUrl}/${userId}`, this.credentials);
    }

    UpdateUserById(userId: string, params: any) {
        return this.http.put<{}>(`${this.baseUrl}/${userId}`, params, this.credentials);
    }

    DeleteUserById(userId: string) {
        return this.http.delete<{}>(`${this.baseUrl}/${userId}`, this.credentials);
    }
}
