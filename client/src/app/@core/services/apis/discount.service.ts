import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl_test } from '../../constants/api.constant';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({ providedIn: 'root' })
export class DiscountService {
    private baseUrl = apiUrl_test + 'discount';
    private credentials = { withCredentials: true };

    constructor(private http: HttpClient) { }

    /**
     * Tạo mã giảm giá mới
     * @param payload { code: string, description?: string, percentage: number, usageLimit: number }
     */
    createDiscount(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/`, payload, this.credentials);
    }

    /**
     * Lấy danh sách mã giảm giá
     */
    getDiscounts(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/`, this.credentials);
    }

    getPublicDiscounts(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/public`, this.credentials);
    }

    /**
     * Vô hiệu hóa mã giảm giá
     * @param code mã cần vô hiệu
     */
    deactivateDiscount(code: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/deactivate`, { code }, this.credentials);
    }
}
