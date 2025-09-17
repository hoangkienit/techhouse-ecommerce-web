import { Injectable } from '@angular/core';
import { TranslationService } from './translate.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class AppServices {

    constructor(
        public TranslateService: TranslationService,
        public AuthService: AuthService
    ) { }
}
