import mongoose, { HydratedDocument, Schema } from "mongoose";
import { ICart, ICartItem } from "../interfaces/cart.interface";

export type CartDocument = HydratedDocument<ICart>;

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    product_name: { type: String, required: true },
    product_brand: { type: String, required: true },
    product_img: { type: String },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 }
  },
  { _id: true }
);

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestId: { type: String, unique: true, sparse: true, index: true },
    currency: { type: String, default: "USD" },
    items: { type: [cartItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
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
    contactEmail: { type: String },
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
    checkoutTimeline: {
      type: [
        new Schema(
          {
            step: {
              type: String,
              enum: ["cart", "shipping", "payment", "review", "placed"],
              required: true
            },
            time: { type: Date, required: true }
          },
          { _id: false }
        )
      ],
      default: () => [{ step: "cart", time: new Date() }]
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
