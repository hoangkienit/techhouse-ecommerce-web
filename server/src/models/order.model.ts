import mongoose, { HydratedDocument, Schema } from "mongoose";
import { IOrder } from "../interfaces/order.interface";

export type OrderDocument = HydratedDocument<IOrder>;

const orderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestId: { type: String, index: true },
    contactEmail: { type: String },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        product_name: { type: String, required: true },
        product_brand: { type: String, required: true },
        product_img: { type: String },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        lineTotal: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    discountCode: { type: String, default: null },
    discountRate: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    shippingAddress: {
      fullName: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ["card", "cod", "paypal", "bank_transfer"]
      },
      provider: String,
      last4: String,
      transactionId: String,
      note: String
    },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["created", "paid", "fulfilled", "cancelled"],
      default: "created"
    },
    placedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
