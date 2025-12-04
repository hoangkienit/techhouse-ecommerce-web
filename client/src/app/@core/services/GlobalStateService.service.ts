import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserDtoRequest } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {

    private _currentUser = new BehaviorSubject<UserDtoRequest | null>(null);

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
