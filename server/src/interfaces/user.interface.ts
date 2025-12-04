
import { Types } from "mongoose";
import { IAddress } from "./address.interface";

export interface IUser {
  _id?: string | Types.ObjectId;
  fullname: string;
  email: string;
  phone?: string;
  password?: string;
  profileImg?: string;
  role: "user" | "admin" | "manager";
  socialProvider?: "google" | "facebook" | "github" | "apple" | null;
  socialId?: string | null;
  addresses: IAddress[];
  isBanned: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  loyalty_points?: number;
}

export interface IUserQueryOptions {
  q?: string | undefined;
  page: number;
  limit: number;
  pageIndex?: number;
  pageSize?: number;
  fullname?: string | undefined;
  phone?: string | undefined;
  role?: string | undefined;
  email?: string | undefined;
  isBanned?: boolean | undefined;
  socialProvider?: string | undefined;
  loyalty_points?: number;
}
