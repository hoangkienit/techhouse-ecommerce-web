import { UserRoles } from "../constants/role.constant";

export interface UserDtoResponse {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
    profileImg: string;
    role: UserRoles.ADMIN | UserRoles.USER | string;
    socialProvider: string | null;
    socialId: string | null;
    addresses?: string;
    isBanned: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface filterUser {
    q?: string;
    fullname?: string | undefined;
    phone?: string | undefined;
    role?: string | undefined;
    email?: string | undefined;
    isBanned?: boolean | undefined;
    socialProvider?: string | undefined;
    loyalty_points?: number;
}
