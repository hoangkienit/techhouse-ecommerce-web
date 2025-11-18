import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    // set default languages
    this.translate.addLangs(['en', 'vi']);
    this.translate.setDefaultLang('vi');
    this.translate.use('vi'); // load ngay từ đầu
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
  }

  trans(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get(key: string | string[], params?: any): Observable<any> {
    return this.translate.get(key, params);
  }

  onLangChange(): Observable<LangChangeEvent> {
    return this.translate.onLangChange;
  }

  get currentLang(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }
}
