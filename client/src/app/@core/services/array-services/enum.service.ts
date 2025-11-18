export class EnumService {
    static ParseEnumToArray<T extends object>(enumObj: T): { label: string; value: keyof T }[] {
        return Object.keys(enumObj)
            .filter(key => isNaN(Number(key))) // lọc bỏ key kiểu number (dành cho enum number)
            .map(key => ({
                label: key,
                value: key as keyof T
            }));
    }
}
