import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl_test } from '../../constants/api.constant';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = apiUrl_test + 'order';
  private credentials = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getOrders(params: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`, { params: buildHttpParams(params), ...this.credentials });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${orderId}/status`, { status }, this.credentials);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${orderId}`, this.credentials);
  }
}
