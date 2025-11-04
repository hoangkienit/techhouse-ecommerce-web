import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private snackBar: MatSnackBar) { }

    createNotification(
        message: string,
        type: 'success' | 'error' | 'info' = 'info',
        duration: number = 3000
    ) {
        let panelClass = '';
        switch (type) {
            case 'success':
                panelClass = 'snackbar-success';
                break;
            case 'error':
                panelClass = 'snackbar-error';
                break;
            default:
                panelClass = 'snackbar-info';
                break;
        }

        this.snackBar.open(message, 'Đóng', {
            duration,
            panelClass: [panelClass],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
        });
    }
}
