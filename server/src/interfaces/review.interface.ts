import { Types } from "mongoose";

export interface IPagination {
    skip?: number;
    page: number | 1;
    limit: number | 10;
}

export interface ICommentListOptions extends IPagination {
  productId: string;
}

export interface IRatingListOptions extends IPagination {
  productId: string;
}


export interface IComment {
  _id?: Types.ObjectId;
  productId: Types.ObjectId | string;
  displayName?: string;
  content: string;
  ipHash?: string;                    // hash(IP + secret)
  userId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IRating {
  _id?: Types.ObjectId;
  productId: Types.ObjectId | String;   // Reference to Product
  userId: Types.ObjectId;      // Reference to User
  stars: number;               // 1–5 rating
  createdAt?: Date;
  updatedAt?: Date;
}

