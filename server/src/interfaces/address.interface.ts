
import { Types } from "mongoose";

export interface IAddress {
    _id?: Types.ObjectId | string;
    userId?: Types.ObjectId | string;
    label?: string | null;
    fullName?: string | null;
    phone?: string | null;
    street: string;
    city: string;
    state?: string | null;
    postalCode?: string | null;
    country: string;
    isDefault: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
