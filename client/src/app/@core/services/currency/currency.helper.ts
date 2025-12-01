export class CurrencyHelper {
    minValue: string = '';
    maxValue: string = '';

    setMinValue(minVal: string | number) {
        this.minValue = String(minVal);
        this.formatCurrency('min');
    }

    setMaxValue(maxVal: string | number) {
        this.maxValue = String(maxVal);
        this.formatCurrency('max');
    }

    formatCurrency(field: 'min' | 'max') {
        let value = field === 'min' ? this.minValue : this.maxValue;

        // Loại bỏ ký tự không phải số
        value = value.replace(/\D/g, '');

        // Thêm dấu phân tách hàng nghìn
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        if (field === 'min') this.minValue = value;
        else this.maxValue = value;
    }
}
