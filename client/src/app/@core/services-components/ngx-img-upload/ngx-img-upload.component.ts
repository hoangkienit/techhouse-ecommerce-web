import { AppServices } from 'src/app/@core/services/AppServices.service';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-img-upload',
  templateUrl: './ngx-img-upload.component.html',
  styleUrls: ['./ngx-img-upload.component.scss']
})
export class NgxImgUploadComponent {
  @Output() uploaded = new EventEmitter<string[]>(); // emit URL hoặc file ID backend trả về

  files: File[] = [];
  previewUrls: string[] = [];
  progress: number[] = [];

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
    Array.from(files).forEach(file => {
      this.files.push(file);
      this.progress.push(0);

      const reader = new FileReader();
      reader.onload = () => this.previewUrls.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    this.startUpload();
  }

  private startUpload() {
    this.files.forEach((file, index) => {
      this._appServices.UploadService.upload(file).subscribe(p => {
        this.progress[index] = p;

        if (p === 100) {
          // có thể emit danh sách file đã upload
          this.uploaded.emit(this.previewUrls);
        }
      });
    });
  }
}
