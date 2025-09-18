import { Injectable } from '@angular/core';
import { TranslationService } from './translate.service';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

@Injectable({
    providedIn: 'root'
})

export class AppServices {

    constructor(
        public TranslateService: TranslationService,
        public AuthService: AuthService,
        public ProductService: ProductService
    ) { }
}
