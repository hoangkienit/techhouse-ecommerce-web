import { Injectable, Type } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { BaseModalComponentComponent } from '../services-components/base-modal-component/base-modal-component.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private dialogRef?: NbDialogRef<any>;

    constructor(private dialogService: NbDialogService) { }

    createModal(
        header: string,
        bodyComponent: Type<any>,
        context?: any
    ): NbDialogRef<any> {
        this.dialogRef = this.dialogService.open(BaseModalComponentComponent, {
            context: {
                header,
                bodyComponent,
                context,
                close: () => this.closeModal(),
            },
            closeOnBackdropClick: true,
            hasScroll: true,
            autoFocus: false,
            dialogClass: 'custom-modal',
        });

        return this.dialogRef;
    }

    closeModal(data?: any) {
        if (this.dialogRef) {
            this.dialogRef.close(data);
            this.dialogRef = undefined;
        }
    }
}
