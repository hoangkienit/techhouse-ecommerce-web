import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private apiUrl = '/api/upload'; // đổi URL tùy backend của Nô

    constructor(private http: HttpClient) { }

    upload(file: File): Observable<number> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http
            .post(this.apiUrl, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                map(event => {
                    switch (event.type) {
                        case HttpEventType.UploadProgress:
                            return Math.round((event.loaded / (event.total ?? 1)) * 100);
                        case HttpEventType.Response:
                            return 100;
                        default:
                            return 0;
                    }
                })
            );
    }
}
