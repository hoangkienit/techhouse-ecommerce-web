import { CartService } from './apis/cart.service';
import { UserService } from './apis/user.service';
import { UploadService } from './UploadService.service';
import { AuthService } from './apis/auth.service';
import { ModalService } from './Modal.service';
import { GlobalStateService } from './GlobalStateService.service';
import { Injectable } from '@angular/core';
import { TranslationService } from './translate.service';
import { ProductService } from './apis/product.service';
import { NotificationService } from './notification.service';
import { AddressService } from './apis/address.service';
import { OrderService } from './apis/order.service';

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
        public UserService: UserService,
        public AddressService: AddressService,
        public OrderService: OrderService,
        public CartService: CartService,
    ) { }
}
