import { IOrder, IOrderQueryOptions } from "../interfaces/order.interface";
import OrderRepo from "../repositories/order.repository";
import mongoose, { ClientSession } from "mongoose";
import LoyaltyService from "./loyalty.service";
import { BadRequestError, NotFoundError } from "../core/error.response";
import OrderFeedbackRepo from "../repositories/order-feedback.repository";

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

  static async GetDashboard() {
    const totalOrders = await OrderRepo.countAll();
    const statusCounts = await OrderRepo.countByAllStatuses();
    const latestOrders = await OrderRepo.findLatest(5);
    return { totalOrders, statusCounts, latestOrders };
  }

  static async GetRevenueBoard() {
    const orders = await OrderRepo.findPaidOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalDiscount = orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
    const totalOrders = orders.length;
    return { totalRevenue, totalDiscount, totalOrders };
  }

  static async GetTopProductsBoard(limit = 5) {
    return OrderRepo.findTopProducts(limit);
  }

  static async GetCustomerBoard() {
    return OrderRepo.aggregateCustomers();
  }

  static async GetPaymentMethodBoard() {
    return OrderRepo.aggregatePaymentMethods();
  }

  static async AddFeedback(params: { orderId: string; userId?: string; guestId?: string; rating: number; comment?: string; isAdmin?: boolean }) {
    const { orderId, userId, guestId, rating, comment, isAdmin } = params;
    const order = await OrderRepo.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");
    if (order.status !== "fulfilled") throw new BadRequestError("Order is not completed yet");

    const ownerId =
      order.user && typeof order.user === "object" && (order.user as any)._id
        ? String((order.user as any)._id)
        : order.user
          ? String(order.user)
          : null;

    if (!isAdmin) {
      if (ownerId) {
        if (!userId || ownerId !== String(userId)) {
          throw new BadRequestError("Bạn không thể đánh giá đơn hàng này");
        }
      } else if (order.guestId) {
        if (!guestId || order.guestId !== guestId) {
          throw new BadRequestError("Bạn không thể đánh giá đơn hàng này");
        }
      }
    }

    const existed = await OrderFeedbackRepo.findExisting(orderId, userId, guestId);
    if (existed) throw new BadRequestError("Bạn đã đánh giá đơn hàng này");

    return OrderFeedbackRepo.create({
      order: orderId,
      user: userId ?? "",
      guestId: guestId || null,
      rating: rating ?? 0,
      comment: comment || ""
    });
  }

  static async ListFeedback(orderId: string, requester?: { userId?: string; isAdmin?: boolean }) {
    const order = await OrderRepo.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");

    if (!requester?.isAdmin) {
      if (order.user && requester?.userId && String(order.user) !== String(requester.userId)) {
        throw new BadRequestError("Không được phép xem");
      }
    }

    return OrderFeedbackRepo.findByOrder(orderId);
  }
}

export default OrderService;
