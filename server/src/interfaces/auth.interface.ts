
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: object;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: object;
}

export interface JwtPayload {
    userId: string;
    fullname: string;
    role: string;
}