import { GlobalStateService } from './GlobalStateService.service';
import { Injectable } from '@angular/core';
import { TranslationService } from './translate.service';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})

export class AppServices {

    constructor(
        public TranslateService: TranslationService,
        public AuthService: AuthService,
        public ProductService: ProductService,
        public NotificationService: NotificationService,
        public GlobalStateService: GlobalStateService
    ) { }
}
