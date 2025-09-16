
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: object;
}

export interface JwtPayload {
    userId: string;
    username: string;
    role: string;
}