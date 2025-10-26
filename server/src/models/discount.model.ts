import mongoose, { HydratedDocument, Schema } from "mongoose";
import { IDiscountCode } from "../interfaces/discount.interface";

export type DiscountCodeDocument = HydratedDocument<IDiscountCode>;

const discountCodeSchema = new Schema<IDiscountCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, minlength: 5, maxlength: 10 },
    description: { type: String, default: null },
    percentage: { type: Number, required: true, min: 1, max: 100 },
    usageLimit: { type: Number, required: true, min: 1, max: 10 },
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

const DiscountCode = mongoose.model<IDiscountCode>("DiscountCode", discountCodeSchema);

export default DiscountCode;
