import Joi from "joi";

export const createCommentSchema = () => Joi.object({
  displayName: Joi.string().trim().max(40).allow("", null),
  content: Joi.string().min(1).max(2000).required(),
});

export const rateProductSchema = () =>  Joi.object({
  stars: Joi.number().integer().min(1).max(5).required(),
});
