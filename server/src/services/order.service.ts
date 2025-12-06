import { IOrder, IOrderQueryOptions } from "../interfaces/order.interface";
import OrderRepo from "../repositories/order.repository";
import mongoose, { ClientSession } from "mongoose";
import LoyaltyService from "./loyalty.service";
import { BadRequestError } from "../core/error.response";

class OrderService {
  static async CreateOrder(data: Partial<IOrder>, options?: { session?: ClientSession }) {
    return await OrderRepo.create(data, options);
  }

  static async GetOrders(options: IOrderQueryOptions) {
    const {
      q,
      orderCode,
      userId,
      guestId,
      status,
      sort = "newest",
      page = 1,
      limit = 10
    } = options;

    const filter: Record<string, unknown> = {};

    if (userId) filter.user = userId;
    if (guestId) filter.guestId = guestId;
    if (status) {
      if (Array.isArray(status)) {
        filter.status = { $in: status };
      } else {
        filter.status = status;
      }
    }

    if (q && orderCode && orderCode.trim() && q.trim()) {
      const orFilter: any[] = [
        { contactEmail: { $regex: q, $options: "i" } },
        { orderCode: { $regex: orderCode, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$user" }, // ép ObjectId về string
              regex: q,
              options: "i"
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$guestId" }, // ép ObjectId về string
              regex: q,
              options: "i"
            }
          }
        }
      ];

      filter.$or = orFilter;
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const currentLimit = Math.min(100, Math.max(1, Number(limit) || 10));

    const { orders, total } = await OrderRepo.findAll(filter, currentPage, currentLimit, sort ?? "newest");
    const totalPages = Math.max(1, Math.ceil(total / currentLimit));

    return {
      orders,
      pagination: {
        total,
        pageIndex: currentPage,
        pageSize: currentLimit,
        totalItems: total
      }
    };
  }

  static async GetOrderDetail(orderId: string, requester: { userId?: string | null; role?: string | null }) {
    const order = await OrderRepo.findById(orderId);
    if (!order) return null;

    const isAdmin = requester.role === "admin" || requester.role === "manager";

    if (!isAdmin) {
      if (order.user) {
        if (order.user.toString() !== requester.userId) {
          return null;
        }
      } else if (order.guestId) {
        if (order.guestId !== requester.userId) {
          return null;
        }
      } else {
        return null;
      }
    }

    return order;
  }

  static async DeleteOrder(orderId: string) {
    if (!await OrderRepo.findById(orderId)) throw new BadRequestError("Order not found");
    await LoyaltyService.DeleteByOrder(orderId);

    await OrderRepo.delete(orderId);

    return true;
  }

  static async UpdateOrderStatus(orderId: string, status: IOrder["status"]) {
    const order = await OrderRepo.update(orderId, { status });
    if (!order) throw new BadRequestError("Order not found");
    return order;
  }
}

export default OrderService;
