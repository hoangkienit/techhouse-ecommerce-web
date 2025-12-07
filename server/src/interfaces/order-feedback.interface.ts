import { Types } from "mongoose";

export interface IOrderFeedback {
  _id?: Types.ObjectId | string;
  order: Types.ObjectId | string;
  user?: Types.ObjectId | string;
  guestId?: string | null;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
