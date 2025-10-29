import Joi from "joi";

export const loginSchema = () =>
  Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "any.required": "Email là bắt buộc",
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
      }),

    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "any.required": "Mật khẩu là bắt buộc",
        "string.empty": "Mật khẩu không được để trống",
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
      }),
  });

export const registerSchema = () =>
  Joi.object({
    fullname: Joi.string()
      .min(2)
      .required()
      .messages({
        "any.required": "Họ tên là bắt buộc",
        "string.empty": "Họ tên không được để trống",
        "string.min": "Họ tên phải có ít nhất 2 ký tự",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "any.required": "Email là bắt buộc",
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
      }),
    address: Joi.object({
      street: Joi.string().trim().min(3).max(200).required(),
      city: Joi.string().trim().min(2).max(120).required(),
      state: Joi.string().trim().allow("", null),
      postalCode: Joi.string().trim().allow("", null),
      country: Joi.string().trim().min(2).max(120).required(),
      label: Joi.string().trim().allow("", null),
      fullName: Joi.string().trim().allow("", null),
      phone: Joi.string().trim().allow("", null)
    }).required()
  }).unknown(true);
