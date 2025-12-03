import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl_test } from '../../constants/api.constant';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = apiUrl_test + 'users';
  private credentials = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getAllUsers(params: any): Observable<any> {
    return this.http.get<any>(this.baseUrl, { params: buildHttpParams(params), ...this.credentials });
  }

  updateUserStatus(userId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/status`, { status }, this.credentials);
  }

  updateUser(userId: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${userId}`, payload, this.credentials);
  }
}
