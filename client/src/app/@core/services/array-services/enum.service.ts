export class EnumService {
    static ParseEnumToArray<T extends Record<string, string>>(enumObj: T) {
        return Object.entries(enumObj).map(([key, value]) => ({
            label: key,
            value: value
        }));
    }
}
