export interface AuthDtos {
    username: string;
    email: string;
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
