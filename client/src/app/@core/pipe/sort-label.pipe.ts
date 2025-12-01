// sort-label.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { SortAction } from '../enums/sort.enum';

const SortActionLabels: Record<SortAction, string> = {
    [SortAction.NAME_ASC]: 'Tăng dần theo tên',
    [SortAction.NAME_DESC]: 'Giảm dần theo tên',
    [SortAction.PRICE_ASC]: 'Tăng dần theo giá',
    [SortAction.PRICE_DESC]: 'Giảm dần theo giá',
    [SortAction.NEWEST]: 'Sản phẩm mới nhất',
};

@Pipe({ name: 'sortLabel' })
export class SortLabelPipe implements PipeTransform {
    transform(value: SortAction | string): string {
        return SortActionLabels[value as SortAction] ?? '';
    }
}