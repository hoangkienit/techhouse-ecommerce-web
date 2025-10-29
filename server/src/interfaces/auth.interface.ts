import { IAddress } from "./address.interface";

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    fullname: string;
    email: string;
    address: IAddress;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    user: object;
}

export interface IJwtPayload {
    userId: string;
    fullname: string;
    email: string;
    role: string;
}