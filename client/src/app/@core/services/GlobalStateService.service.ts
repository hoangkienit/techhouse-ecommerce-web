import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDtoRequest } from '../models/auth.model';
import { AuthService } from './apis/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {

    private _currentUser = new BehaviorSubject<UserDtoRequest | null>(null);
    private _currentCart = new BehaviorSubject<any | null>(null);

    constructor(private authService: AuthService) {
        // Khi init, check cookie/token và set user nếu còn session
        const userFromCookie = this.authService.getUserFromCookie();
        if (userFromCookie) {
            this._currentUser.next(userFromCookie);
        }
    }

    currentUser$ = this._currentUser.asObservable();
    currentCart$ = this._currentCart.asObservable();

    setUser(user: UserDtoRequest | null): void {
        this._currentUser.next(user);
    }

    get currentUser(): UserDtoRequest | null {
        return this._currentUser.value;
    }

    clearUser(): void {
        this._currentUser.next(null);
    }

    setCart(cart: any | null): void {
        this._currentCart.next(cart);
    }

    get currentCart(): any | null {
        return this._currentCart.value;
    }

    clearCart(): void {
        this._currentCart.next(null);
    }
}
