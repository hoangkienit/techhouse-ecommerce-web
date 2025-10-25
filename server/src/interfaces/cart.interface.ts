import { Types } from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId | string;
  product: Types.ObjectId | string;
  product_name: string;
  product_brand: string;
  product_img?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface IShippingAddress {
  fullName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

export type PaymentMethodType = "card" | "cod" | "paypal" | "bank_transfer";

export interface IPaymentMethod {
  type: PaymentMethodType;
  provider?: string;
  last4?: string;
  transactionId?: string;
  note?: string;
}

export interface ICart {
  _id?: Types.ObjectId | string;
  user?: Types.ObjectId | string;
  guestId?: string;
  currency: string;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress?: IShippingAddress | null;
  contactEmail?: string | null;
  paymentMethod?: IPaymentMethod | null;
  checkoutStep?: "cart" | "shipping" | "payment" | "review" | "placed";
  status: "active" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartIdentifiers {
  userId?: string;
  cartId?: string;
}

export interface IShippingSelectionPayload {
  shippingAddress?: IShippingAddress;
  addressId?: string;
  contactEmail?: string;
  saveAsNew?: boolean;
  setAsDefault?: boolean;
}
