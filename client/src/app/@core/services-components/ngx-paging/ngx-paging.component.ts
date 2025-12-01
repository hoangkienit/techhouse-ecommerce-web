import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-paging',
  templateUrl: './ngx-paging.component.html',
  styleUrls: ['./ngx-paging.component.scss']
})
export class NgxPagingComponent {
  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;

  @Output() onPageChange = new EventEmitter<{ pageIndex: number, pageSize: number }>();

  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  emitUpdate() {
    this.onPageChange.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  goTo(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageIndex = page;
    this.emitUpdate();
  }

  next() {
    this.goTo(this.pageIndex + 1);
  }

  prev() {
    this.goTo(this.pageIndex - 1);
  }

  changePageSize(size: number) {
    this.pageSize = Number(size);
    this.pageIndex = 1; // luôn reset trang khi đổi size cho đúng logic
    this.emitUpdate();
  }
}
