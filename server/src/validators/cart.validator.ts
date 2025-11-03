import Joi from "joi";
import { PaymentMethodType } from "../interfaces/cart.interface";

const shippingSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required()
    .messages({
      "any.required": "Vui lòng nhập họ tên người nhận",
      "string.empty": "Họ tên người nhận không được để trống",
      "string.min": "Họ tên người nhận phải có ít nhất {#limit} ký tự",
      "string.max": "Họ tên người nhận tối đa {#limit} ký tự"
    }),
  line1: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      "any.required": "Vui lòng nhập địa chỉ giao hàng",
      "string.empty": "Địa chỉ giao hàng không được để trống",
      "string.min": "Địa chỉ giao hàng phải có ít nhất {#limit} ký tự",
      "string.max": "Địa chỉ giao hàng tối đa {#limit} ký tự"
    }),
  line2: Joi.string().allow("", null),
  city: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required()
    .messages({
      "any.required": "Vui lòng nhập thành phố",
      "string.empty": "Thành phố không được để trống",
      "string.min": "Thành phố phải có ít nhất {#limit} ký tự",
      "string.max": "Thành phố tối đa {#limit} ký tự"
    }),
  state: Joi.string().trim().allow("", null),
  postalCode: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .allow("", null)
    .messages({
      "string.min": "Mã bưu chính phải có ít nhất {#limit} ký tự",
      "string.max": "Mã bưu chính tối đa {#limit} ký tự"
    }),
  country: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .required()
    .messages({
      "any.required": "Vui lòng nhập quốc gia",
      "string.empty": "Quốc gia không được để trống",
      "string.min": "Quốc gia phải có ít nhất {#limit} ký tự",
      "string.max": "Quốc gia tối đa {#limit} ký tự"
    }),
  phone: Joi.string()
    .trim()
    .min(6)
    .max(30)
    .allow("", null)
    .messages({
      "string.min": "Số điện thoại phải có ít nhất {#limit} ký tự",
      "string.max": "Số điện thoại tối đa {#limit} ký tự"
    })
});

const paymentTypeValues: PaymentMethodType[] = ["card", "cod", "paypal", "bank_transfer"];

export const addCartItemSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    productId: Joi.string().required().messages({
      "any.required": "Vui lòng chọn sản phẩm",
      "string.empty": "Mã sản phẩm không hợp lệ"
    }),
    quantity: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        "number.base": "Số lượng phải là số",
        "number.integer": "Số lượng phải là số nguyên",
        "number.min": "Số lượng tối thiểu là {#limit}"
      })
  });

export const updateCartItemSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    quantity: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "any.required": "Vui lòng nhập số lượng",
        "number.base": "Số lượng phải là số",
        "number.integer": "Số lượng phải là số nguyên",
        "number.min": "Số lượng tối thiểu là {#limit}"
      })
  });

export const shippingDetailsSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    contactEmail: Joi.string()
      .email()
      .optional()
      .messages({
        "string.email": "Email liên hệ không hợp lệ"
      }),
    shippingName: Joi.string().optional(),
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
        .required()
        .messages({
          "any.required": "Vui lòng chọn phương thức thanh toán",
          "any.only": "Phương thức thanh toán không hợp lệ"
        }),
      provider: Joi.string().trim().allow("", null).messages({
        "string.base": "Tên nhà cung cấp thanh toán phải là chuỗi ký tự"
      }),
      last4: Joi.string()
        .pattern(/^\d{4}$/)
        .allow(null)
        .messages({
          "string.pattern.base": "4 số cuối thẻ phải gồm đúng 4 chữ số"
        }),
      transactionId: Joi.string().trim().allow("", null).messages({
        "string.base": "Mã giao dịch phải là chuỗi ký tự"
      }),
      note: Joi.string().trim().allow("", null).messages({
        "string.base": "Ghi chú phải là chuỗi ký tự"
      })
    }).required()
  });

export const confirmCheckoutSchema = () =>
  Joi.object({
    cartId: Joi.string().optional()
  });

export const applyDiscountSchema = () =>
  Joi.object({
    cartId: Joi.string().optional(),
    code: Joi.string()
      .uppercase()
      .regex(/^[A-Z0-9]{5}$/)
      .required()
      .messages({
        "any.required": "Vui lòng nhập mã giảm giá",
        "string.empty": "Mã giảm giá không được để trống",
        "string.pattern.base": "Mã giảm giá phải gồm 5 ký tự chữ hoặc số"
      })
  });
