import { Types } from "mongoose";
import { ICartItem, IShippingAddress, IPaymentMethod } from "./cart.interface";

export interface IOrder {
  _id?: Types.ObjectId | string;
  orderCode: string;
  user?: Types.ObjectId | string;
  guestId?: string;
  contactEmail?: string | null;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discountCode?: string | null;
  discountRate?: number | null;
  discountAmount?: number;
  shippingAddress?: IShippingAddress | null;
  paymentMethod?: IPaymentMethod | null;
  currency: string;
  status: "created" | "paid" | "fulfilled" | "cancelled";
  placedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderQueryOptions {
  userId?: string;
  guestId?: string;
  status?: Array<IOrder["status"]> | IOrder["status"];
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}
