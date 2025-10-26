import Joi from "joi";

const baseAddressSchema = {
  label: Joi.string().trim().max(100).allow("", null).messages({
    "string.base": "Nhãn địa chỉ phải là chuỗi ký tự",
    "string.max": "Nhãn địa chỉ tối đa {#limit} ký tự"
  }),
  fullName: Joi.string().trim().max(120).allow("", null).messages({
    "string.base": "Họ tên phải là chuỗi ký tự",
    "string.max": "Họ tên tối đa {#limit} ký tự"
  }),
  phone: Joi.string().trim().max(30).allow("", null).messages({
    "string.base": "Số điện thoại phải là chuỗi ký tự",
    "string.max": "Số điện thoại tối đa {#limit} ký tự"
  }),
  street: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      "any.required": "Vui lòng nhập địa chỉ",
      "string.empty": "Địa chỉ không được để trống",
      "string.min": "Địa chỉ phải có ít nhất {#limit} ký tự",
      "string.max": "Địa chỉ tối đa {#limit} ký tự"
    }),
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
  postalCode: Joi.string().trim().allow("", null).messages({
    "string.base": "Mã bưu chính phải là chuỗi ký tự"
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
  isDefault: Joi.boolean().optional().messages({
    "boolean.base": "Giá trị địa chỉ mặc định không hợp lệ"
  })
};

export const addressCreateSchema = () =>
  Joi.object(baseAddressSchema);

export const addressUpdateSchema = () =>
  Joi.object({
    ...baseAddressSchema,
    street: Joi.string().trim().min(3).max(200).optional(),
    city: Joi.string().trim().min(2).max(120).optional(),
    country: Joi.string().trim().min(2).max(120).optional()
  });
