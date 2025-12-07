import mongoose, { Schema } from "mongoose";
import { IOrderFeedback } from "../interfaces/order-feedback.interface";

const OrderFeedbackSchema = new Schema<IOrderFeedback>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestId: { type: String, index: true, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" }
  },
  { timestamps: true }
);

OrderFeedbackSchema.index({ order: 1, user: 1, guestId: 1 }, { unique: true, sparse: true });

const OrderFeedback = mongoose.model<IOrderFeedback>("OrderFeedback", OrderFeedbackSchema);

export default OrderFeedback;
