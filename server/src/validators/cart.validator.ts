import Joi from "joi";
import { PaymentMethodType } from "../interfaces/cart.interface";

const shippingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  line1: Joi.string().trim().min(3).max(200).required(),
  line2: Joi.string().allow("", null),
  city: Joi.string().trim().min(2).max(120).required(),
  state: Joi.string().trim().allow("", null),
  postalCode: Joi.string().trim().min(3).max(20).allow("", null),
  country: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().min(6).max(30).allow("", null)
});

const paymentTypeValues: PaymentMethodType[] = ["card", "cod", "paypal", "bank_transfer"];

export const addCartItemSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1)
  });

export const updateCartItemSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    quantity: Joi.number().integer().min(0).required()
  });

export const shippingDetailsSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    contactEmail: Joi.string().email().optional(),
    addressId: Joi.string().optional(),
    saveAsNew: Joi.boolean().optional(),
    setAsDefault: Joi.boolean().optional(),
    shippingAddress: shippingSchema.optional()
  }).custom((value, helpers) => {
    if (!value.addressId && !value.shippingAddress) {
      return helpers.error("any.invalid", { message: "Cần cung cấp addressId hoặc shippingAddress" });
    }
    if (value.saveAsNew && !value.shippingAddress) {
      return helpers.error("any.invalid", { message: "shippingAddress bắt buộc khi lưu địa chỉ mới" });
    }
    return value;
  }, "shipping selection validation");

export const paymentMethodSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    paymentMethod: Joi.object({
      type: Joi.string()
        .valid(...paymentTypeValues)
        .required(),
      provider: Joi.string().trim().allow("", null),
      last4: Joi.string().pattern(/^\d{4}$/).allow(null),
      transactionId: Joi.string().trim().allow("", null),
      note: Joi.string().trim().allow("", null)
    }).required()
  });

export const confirmCheckoutSchema = () =>
  Joi.object({
    cartId: Joi.string().optional()
  });
