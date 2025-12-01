import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filterProduct, Product } from '../../models/product.model';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { buildHttpParams } from '../BuildHttpParams.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = apiUrl + 'product';
  // private baseUrl = apiUrl_test + 'product';
  private credentials = { withCredentials: true };

  constructor(private http: HttpClient) { }

  addProduct(product: any): Observable<any> {
    return this.http.post<{}>(`${this.baseUrl}/add`, product, this.credentials);
  }

  getAllProducts(params: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/list`, { params: buildHttpParams(params), ...this.credentials });
  }

  updateProducts(formData: FormData): Observable<any> {
    const productId = formData.get('productId');

    return this.http.patch<any>(
      `${this.baseUrl}/update/${productId}`,
      formData,
      {
        headers: {},
        withCredentials: true
      }
    );
  }
}
