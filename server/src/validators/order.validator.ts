import Joi from "joi";
import { OrderStatus } from "../interfaces/order.interface";

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "paid", "fulfilled", "cancelled"];

export const updateOrderStatusSchema = () =>
  Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .required()
      .messages({
        "any.only": `Trạng thái đơn hàng phải là một trong: ${ORDER_STATUSES.join(", ")}`,
        "any.required": "Trạng thái đơn hàng là bắt buộc"
      })
  });

export const createOrderFeedbackSchema = () =>
  Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      "any.required": "rating is required",
      "number.base": "rating must be a number",
      "number.min": "rating must be at least {#limit}",
      "number.max": "rating must be at most {#limit}"
    }),
    comment: Joi.string().allow("", null).max(500).messages({
      "string.max": "Bình luận quá dài"
    }),
    guestId: Joi.string().allow("", null)
  });
