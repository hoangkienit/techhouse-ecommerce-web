import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService) {
    // set default
    this.translate.addLangs(['en', 'vi']);
    this.translate.setDefaultLang('vi');
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
  }

  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get currentLang(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }
}

