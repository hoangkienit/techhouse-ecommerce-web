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
      street: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
          "any.required": "Địa chỉ chi tiết là bắt buộc",
          "string.empty": "Địa chỉ chi tiết không được để trống",
          "string.min": "Địa chỉ phải có ít nhất 3 ký tự",
          "string.max": "Địa chỉ không được vượt quá 200 ký tự",
        }),

      city: Joi.string()
        .trim()
        .min(2)
        .max(120)
        .required()
        .messages({
          "any.required": "Thành phố là bắt buộc",
          "string.empty": "Thành phố không được để trống",
          "string.min": "Tên thành phố phải có ít nhất 2 ký tự",
        }),

      state: Joi.string()
        .trim()
        .allow("", null)
        .messages({
          "string.base": "Tên tỉnh/thành không hợp lệ",
        }),

      postalCode: Joi.string()
        .trim()
        .allow("", null)
        .messages({
          "string.base": "Mã bưu điện không hợp lệ",
        }),

      country: Joi.string()
        .trim()
        .min(2)
        .max(120)
        .required()
        .messages({
          "any.required": "Quốc gia là bắt buộc",
          "string.empty": "Quốc gia không được để trống",
          "string.min": "Tên quốc gia phải có ít nhất 2 ký tự",
        }),

      label: Joi.string()
        .trim()
        .allow("", null)
        .messages({
          "string.base": "Nhãn địa chỉ không hợp lệ",
        }),

      fullName: Joi.string()
        .trim()
        .allow("", null)
        .messages({
          "string.base": "Tên người nhận không hợp lệ",
        }),

      phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{9,11}$/)
        .allow("", null)
        .messages({
          "string.pattern.base": "Số điện thoại phải có từ 9 đến 11 chữ số",
        }),
        isDefault: Joi.boolean().optional()
    }).required()
      .messages({
        "any.required": "Địa chỉ là bắt buộc",
      }),
  }).unknown(true);
