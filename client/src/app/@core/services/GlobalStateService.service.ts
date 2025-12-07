import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDtoRequest } from '../models/auth.model';
import { AuthService } from './apis/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {

    private _currentUser = new BehaviorSubject<UserDtoRequest | null>(null);

    constructor(private authService: AuthService) {
        // Khi init, check cookie/token và set user nếu còn session
        const userFromCookie = this.authService.getUserFromCookie();
        if (userFromCookie) {
            this._currentUser.next(userFromCookie);
        }
    }

    currentUser$ = this._currentUser.asObservable();

    setUser(user: UserDtoRequest | null): void {
        this._currentUser.next(user);
    }

    get currentUser(): UserDtoRequest | null {
        return this._currentUser.value;
    }

    clearUser(): void {
        this._currentUser.next(null);
    }
}
