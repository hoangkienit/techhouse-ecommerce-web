export interface AuthDtos {
    fullname: string;
    email: string;
    address?: AddressDto;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
    oldPassword?: string;
    rememberMe?: boolean;
}

export interface AddressDto {
    country: string;
    city: string;
    street: string;
}

export interface User {
    fullname: string;
    email: string;
    phone?: string;
    password?: string;
    profileImg?: string;
    role: string;
    socialProvider?: string | null;
    socialId?: string | null;
    address?: AddressDto;
    addresses?: string[];
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
    properties?: Record<string, any>;
}
