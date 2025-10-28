import { IOrder, IOrderQueryOptions } from "../interfaces/order.interface";
import OrderRepo from "../repositories/order.repository";

class OrderService {
  static async CreateOrder(data: Partial<IOrder>) {
    return await OrderRepo.create(data);
  }

  static async GetOrders(options: IOrderQueryOptions) {
    const {
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

    const currentPage = Math.max(1, Number(page) || 1);
    const currentLimit = Math.min(100, Math.max(1, Number(limit) || 10));

    const { orders, total } = await OrderRepo.findAll(filter, currentPage, currentLimit, sort ?? "newest");
    const totalPages = Math.max(1, Math.ceil(total / currentLimit));

    return {
      orders,
      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages
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
}

export default OrderService;
