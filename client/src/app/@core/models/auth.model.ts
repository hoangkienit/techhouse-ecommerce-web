export interface AuthDtos {
    fullname: string;
    email: string;
    address?: string;
    phone?: string;
    password: string;
    confirmPassword: string;
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
