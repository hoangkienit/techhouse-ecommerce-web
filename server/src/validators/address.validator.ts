import Joi from "joi";

const baseAddressSchema = {
  label: Joi.string().trim().max(100).allow("", null),
  fullName: Joi.string().trim().max(120).allow("", null),
  phone: Joi.string().trim().max(30).allow("", null),
  street: Joi.string().trim().min(3).max(200).required(),
  city: Joi.string().trim().min(2).max(120).required(),
  state: Joi.string().trim().allow("", null),
  postalCode: Joi.string().trim().allow("", null),
  country: Joi.string().trim().min(2).max(120).required(),
  isDefault: Joi.boolean().optional()
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
