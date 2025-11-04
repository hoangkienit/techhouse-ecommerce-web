export interface AuthDtos {
    fullname: string;
    email: string;
    address?: AddressDto;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    token?: string;
    newPassword?: string;
    oldPassword?: string;
    provider?: string;
    providerToken?: string;
    rememberMe?: boolean;
    refreshToken?: string;
    code?: string;
    redirectUrl?: string;
}

export interface AddressDto {
    country: string;
    city: string;
    street: string;
}
