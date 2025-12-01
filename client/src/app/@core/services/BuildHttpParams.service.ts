import { HttpParams } from "@angular/common/http";

export function buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== undefined && value !== null) {
                httpParams = httpParams.set(key, value.toString());
            }
        });
    }
    return httpParams;
}
