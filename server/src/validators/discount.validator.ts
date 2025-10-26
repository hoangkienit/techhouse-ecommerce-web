import Joi from "joi";

export const discountCreateSchema = () =>
  Joi.object({
    code: Joi.string()
      .uppercase()
      .regex(/^[A-Z0-9]$/)
      .min(5)
      .max(10)
      .required()
      .messages({
        "any.required": "Vui lòng nhập mã giảm giá",
        "string.empty": "Mã giảm giá không được để trống",
        "string.pattern.base": "Mã giảm giá phải gồm 5 ký tự chữ hoặc số",
        "string.length": "Mã giảm giá phải gồm đúng 5 ký tự",
        "string.min": "Mã giảm giá tối thiểu là 5 ký tự",
        "string.max": "Mã giảm giá tối đa là 10 ký tự"
      }),
    description: Joi.string().allow("", null).messages({
      "string.base": "Mô tả phải là chuỗi ký tự"
    }),
    percentage: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .required()
      .messages({
        "any.required": "Vui lòng nhập phần trăm giảm giá",
        "number.base": "Phần trăm giảm giá phải là số",
        "number.integer": "Phần trăm giảm giá phải là số nguyên",
        "number.min": "Phần trăm giảm giá tối thiểu là {#limit}%",
        "number.max": "Phần trăm giảm giá tối đa là {#limit}%"
      }),
    usageLimit: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .required()
      .messages({
        "any.required": "Vui lòng nhập số lượt sử dụng",
        "number.base": "Số lượt sử dụng phải là số",
        "number.integer": "Số lượt sử dụng phải là số nguyên",
        "number.min": "Số lượt sử dụng tối thiểu là {#limit}",
        "number.max": "Số lượt sử dụng tối đa là {#limit}"
      })
  });
