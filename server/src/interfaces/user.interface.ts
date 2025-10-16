// src/interfaces/user.interface.ts

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
}
