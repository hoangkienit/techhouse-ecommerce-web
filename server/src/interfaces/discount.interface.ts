import { Types } from "mongoose";

export interface IDiscountCode {
  _id?: Types.ObjectId | string;
  code: string;
  description?: string | null;
  percentage: number;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
