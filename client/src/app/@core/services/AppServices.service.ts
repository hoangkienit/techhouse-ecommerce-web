import { UploadService } from './UploadService.service';
import { Product } from './../models/product.model';
import { AuthService } from './apis/auth.service';
import { ModalService } from './Modal.service';
import { GlobalStateService } from './GlobalStateService.service';
import { Injectable } from '@angular/core';
import { TranslationService } from './translate.service';
import { ProductService } from './apis/product.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})

export class AppServices {

    constructor(
        //app helper services
        public TranslateService: TranslationService,
        public NotificationService: NotificationService,
        public GlobalStateService: GlobalStateService,
        public ModalService: ModalService,

        //APIS
        public AuthService: AuthService,
        public ProductService: ProductService,
        public UploadService: UploadService,
    ) { }
}
