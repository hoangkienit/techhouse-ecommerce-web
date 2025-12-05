import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { BaseModalComponentComponent } from "../services-components/base-modal-component/base-modal-component.component";
import { ConfirmDialogBaseBodyComponent } from "../services-components/confirm-dialog-base-body/confirm-dialog-base-body.component";
import { Injectable, Type } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ModalService {
    private dialogStack: NbDialogRef<any>[] = [];

    constructor(private dialogService: NbDialogService) { }

    private push(ref: NbDialogRef<any>) {
        this.dialogStack.push(ref);
    }

    private pop(): NbDialogRef<any> | undefined {
        return this.dialogStack.pop();
    }

    createModal(
        header: string,
        bodyComponent: Type<any>,
        context?: any,
        closeFunc?: any
    ): NbDialogRef<any> {

        const ref = this.dialogService.open(BaseModalComponentComponent, {
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

        this.push(ref);
        return ref;
    }

    createConfirmDialog(
        message: string,
        title: string = 'Xác nhận',
        okText: string = 'Đồng ý',
        cancelText: string = 'Hủy',
        onConfirm?: () => void,
        onCancel?: () => void
    ): NbDialogRef<any> {

        const ref = this.dialogService.open(BaseModalComponentComponent, {
            context: {
                header: title,
                bodyComponent: ConfirmDialogBaseBodyComponent,
                context: {
                    message,
                    okText,
                    cancelText,
                    confirm: () => {
                        if (onConfirm) onConfirm();
                        this.closeModal(true);
                    },
                    cancel: () => {
                        if (onCancel) onCancel();
                        this.closeModal(false);
                    }
                },
                close: () => this.closeModal(false)
            },
            closeOnBackdropClick: false,
            autoFocus: false,
            dialogClass: 'custom-modal'
        });

        this.push(ref);
        return ref;
    }

    closeModal(data?: any) {
        const ref = this.pop();
        if (ref) {
            ref.close(data);
        }
    }
}