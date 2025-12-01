import { AppServices } from 'src/app/@core/services/AppServices.service';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-img-upload',
  templateUrl: './ngx-img-upload.component.html',
  styleUrls: ['./ngx-img-upload.component.scss']
})
export class NgxImgUploadComponent {

  @Input() maxFiles: number = 5;

  // ➜ choose what to emit
  @Input() emitType: 'files' | 'subscriptions' | 'both' = 'files';

  // ➜ unified output
  @Output() uploaded = new EventEmitter<any>();

  files: File[] = [];
  previewUrls: string[] = [];
  progress: number[] = [];
  uploadSubs: Subscription[] = [];

  isDragging = false;

  constructor(private _appServices: AppServices) { }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onFileSelect(event: any) {
    this.handleFiles(event.target.files);
  }

  private handleFiles(files: FileList) {
    const remaining = this.maxFiles - this.files.length;

    if (remaining <= 0) return;

    Array.from(files)
      .slice(0, remaining)
      .forEach(file => {
        this.files.push(file);
        this.progress.push(0);

        const reader = new FileReader();
        reader.onload = () => this.previewUrls.push(reader.result as string);
        reader.readAsDataURL(file);
      });

    this.emitData();
  }

  private emitData() {
    if (this.emitType === TypeUpload.FILES) {
      this.uploaded.emit(this.files);
    }

    if (this.emitType === TypeUpload.SUBSCRIPTION) {
      this.uploaded.emit(this.uploadSubs);
    }

    if (this.emitType === TypeUpload.BOTH) {
      this.uploaded.emit({
        files: this.files,
        subscriptions: this.uploadSubs
      });
    }
  }

  removeFile(index: number) {
    if (this.uploadSubs[index]) {
      this.uploadSubs[index].unsubscribe();
    }

    this.files.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.progress.splice(index, 1);
    this.uploadSubs.splice(index, 1);

    this.emitData();
  }
}

export enum TypeUpload {
  FILES = 'files',
  SUBSCRIPTION = 'subscriptions',
  BOTH = 'both'
}