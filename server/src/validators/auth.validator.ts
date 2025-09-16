import Joi from 'joi';

export const loginSchema = () => Joi.object({
    username: Joi.string()
        .min(6)
        .required()
        .messages({
            'any.required': 'Tên đăng nhập là bắt buộc',
            'string.empty': 'Tên đăng nhập là bắt buộc',
            'string.min': '',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': '',
            'string.min': '',
        }),
});

export const registerSchema = () => Joi.object({
    username: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': '',
            'string.min': '',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': '',
            'string.email': '',
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{9,12}$/)
        .required()
        .messages({
            'string.empty': '',
            'string.pattern.base': '',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': '',
            'string.min': '',
        }),

    confirmPassword: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .messages({
            'any.only': '',
            'any.required': '',
        }),
});