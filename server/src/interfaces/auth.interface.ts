import { Address } from "./address.interface";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullname: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: Address;
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