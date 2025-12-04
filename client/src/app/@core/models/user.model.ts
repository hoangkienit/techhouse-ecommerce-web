import { roles } from "../constants/role.constant";

export interface UserDtoResponse {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
    profileImg: string;
    role: roles.ADMIN | roles.USER | string;
    socialProvider: string | null;
    socialId: string | null;
    addresses?: string;
    isBanned: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

