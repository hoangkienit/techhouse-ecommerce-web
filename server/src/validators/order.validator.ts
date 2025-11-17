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
