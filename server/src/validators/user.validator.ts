import Joi from "joi";

export const updateInformationSchema = () =>
    Joi.object({
        fullname: Joi.string()
            .required()
            .messages({
                "any.required": "Họ và tên là bắt buộc",
                "string.empty": "Họ và tên không được để trống",
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "any.required": "Email là bắt buộc",
                "string.empty": "Email không được để trống",
                "string.email": "Email không hợp lệ",
            }),
        phone: Joi.string()
            .min(6)
            .max(10)
            .required()
            .messages({
                "any.required": "Số điện thoại là bắt buộc",
                "string.empty": "Số điện thoại không được để trống",
                "string.min": "Số điện thoại phải có ít nhất 6 ký tự",
                "string.max": "Số điện thoại tối đa là 10 ký tự",
            }),
    });