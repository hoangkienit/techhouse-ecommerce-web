export interface AddressDto {
    userId?: string,
    label?: string,
    fullName?: string,
    phone?: string,
    street: string,
    city: string,
    state?: string,
    postalCode?: string,
    country: string,
    isDefault?: boolean
}
