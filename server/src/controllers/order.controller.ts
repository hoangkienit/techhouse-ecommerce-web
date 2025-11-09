
import { Request, Response } from "express";
import OrderService from "../services/order.service";
import { OK } from "../core/success.response";
import { IOrderQueryOptions, IOrder } from "../interfaces/order.interface";
import { NotFoundError, UnauthorizedError } from "../core/error.response";

class OrderController {
  static async GetOrders(req: Request, res: Response) {
    const isAdmin = req.user?.role === "admin" || req.user?.role === "manager";

    const {
      status,
      sort,
      page,
      limit,
      userId: queryUserId,
      guestId
    } = req.query;

    const options: IOrderQueryOptions = {};

    options.sort = sort === "oldest" ? "oldest" : "newest";

    if (typeof page === "string" && page.trim()) {
      options.page = Number(page);
    }

    if (typeof limit === "string" && limit.trim()) {
      options.limit = Number(limit);
    }

    if (typeof status === "string" && status.trim().length > 0) {
      const statuses = status
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) as IOrder["status"][];

      if (statuses.length) {
        options.status = statuses;
      }
    }

    if (typeof guestId === "string" && guestId.trim()) {
      options.guestId = guestId.trim();
    }

    if (isAdmin && typeof queryUserId === "string" && queryUserId.trim()) {
      options.userId = queryUserId.trim();
    } else if (req.user?.userId) {
      options.userId = req.user.userId;
    }

    const result = await OrderService.GetOrders(options);

    new OK({
      message: "Lấy danh sách đơn hàng thành công",
      data: result
    }).send(res);
  }

  static async GetOrderDetail(req: Request, res: Response) {
    const orderId = req.params.orderId;
    if (!orderId) throw new NotFoundError("Không tìm thấy đơn hàng");

    const order = await OrderService.GetOrderDetail(orderId, {
      userId: req.user?.userId ?? null,
      role: req.user?.role ?? null
    });

    if (!order) throw new UnauthorizedError("Bạn không có quyền xem đơn hàng này");

    new OK({
      message: "Lấy thông tin đơn hàng thành công",
      data: { order }
    }).send(res);
  }

  static async DeleteOrder(req: Request, res: Response) {
    const orderId = req.params.orderId;
    if (!orderId) throw new NotFoundError("Không tìm thấy đơn hàng");

    await OrderService.DeleteOrder(orderId);

    new OK({
      message: "Xoá đơn hàng thành công",
      data: {}
    }).send(res);
  }
}

export default OrderController;
