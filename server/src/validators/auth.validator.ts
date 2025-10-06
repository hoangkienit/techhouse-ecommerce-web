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

    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "any.required": "Mật khẩu là bắt buộc",
        "string.empty": "Mật khẩu không được để trống",
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
      }),

    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Xác nhận mật khẩu không khớp",
        "any.required": "Vui lòng nhập lại mật khẩu",
      }),
  }).unknown(true);
