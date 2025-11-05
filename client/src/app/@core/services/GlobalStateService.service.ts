import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {

    private _currentUser = new BehaviorSubject<User | null>(null);

    currentUser$ = this._currentUser.asObservable();

    setUser(user: User | null): void {
        this._currentUser.next(user);
    }

    get currentUser(): User | null {
        return this._currentUser.value;
    }

    clearUser(): void {
        this._currentUser.next(null);
    }
}
