
import { Request, Response } from "express";
import OrderService from "../services/order.service";
import { OK } from "../core/success.response";
import { IOrderQueryOptions, IOrder } from "../interfaces/order.interface";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../core/error.response";
import { Forbidden } from "../utils/error.helper";

class OrderController {
  static async GetOrders(req: Request, res: Response) {
    const isAdmin = req.user?.role === "admin" || req.user?.role === "manager";

    const { orderCode, status, sort, pageIndex, pageSize, userId, guestId, q } = req.query;

    const options: IOrderQueryOptions = {};
    options.sort = sort === "oldest" ? "oldest" : "newest";
    if (typeof pageIndex === "string" && pageIndex.trim()) options.page = Number(pageIndex);
    if (typeof pageSize === "string" && pageSize.trim()) options.limit = Number(pageSize);
    if (typeof orderCode === "string" && orderCode.trim()) options.orderCode = orderCode;

    if (typeof status === "string" && status.trim()) {
      const statuses = status.split(",").map(s => s.trim()).filter(Boolean) as IOrder["status"][];
      if (statuses.length) options.status = statuses;
    }

    if (typeof guestId === "string" && guestId.trim()) options.guestId = guestId.trim();
    if (typeof q === "string" && q.trim()) options.q = q.trim(); // search orderCode hoặc email khách

    if (isAdmin) {
      // Admin: filter theo userId query nếu có, hoặc lấy toàn bộ nếu không
      if (typeof userId === "string" && userId.trim()) options.userId = userId.trim();
    } else if (req.user?.userId) {
      // Người thường: luôn filter theo chính họ
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

  static async UpdateOrderStatus(req: Request, res: Response) {
    const orderId = req.params.orderId;
    if (!orderId) throw new BadRequestError("orderId is required");

    const { status } = req.body as { status: IOrder["status"] };
    const order = await OrderService.UpdateOrderStatus(orderId, status);

    new OK({
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: { order }
    }).send(res);
  }

  static async CreateFeedback(req: Request, res: Response) {
    const orderId = req.params.orderId as string;
    const userId = req.user?.userId;
    if (!orderId) throw new BadRequestError("Thiếu thông tin đơn hàng");

    const { rating, comment, guestId } = req.body;
    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new BadRequestError("rating phải trong khoảng 1-5");
    }

    const feedback = await OrderService.AddFeedback({
      orderId: orderId!,
      userId: userId ?? "",
      guestId,
      isAdmin: ["admin", "manager"].includes(req.user?.role || ""),
      rating: ratingNum,
      comment
    });

    new OK({
      message: "Gửi đánh giá thành công",
      data: { feedback }
    }).send(res);
  }

  static async ListFeedback(req: Request, res: Response) {
    const orderId = req.params.orderId as string;
    if (!orderId) throw new BadRequestError("orderId is required");

    const isAdmin = ["admin", "manager"].includes(req.user?.role || "");
    const userId = req.user?.userId;

    const feedback = await OrderService.ListFeedback(orderId, { userId: userId ?? "", isAdmin });

    new OK({
      message: "Lấy đánh giá thành công",
      data: { feedback }
    }).send(res);
  }


  // Admin board tổng quát
  static async GetDashboard(req: Request, res: Response) {
    if (!["admin", "manager"].includes(req.user?.role || "")) {
      return new Forbidden({ message: "Bạn không có quyền truy cập dashboard" }).send(res);
    }
    const data = await OrderService.GetDashboard();
    new OK({ message: "Dashboard data", data }).send(res);
  }

  static async GetRevenueBoard(req: Request, res: Response) {
    if (!["admin", "manager"].includes(req.user?.role || "")) {
      return new Forbidden({ message: "Bạn không có quyền truy cập dashboard" }).send(res);
    }
    const data = await OrderService.GetRevenueBoard();
    new OK({ message: "Revenue board", data }).send(res);
  }

  static async GetTopProductsBoard(req: Request, res: Response) {
    if (!["admin", "manager"].includes(req.user?.role || "")) {
      return new Forbidden({ message: "Bạn không có quyền truy cập dashboard" }).send(res);
    }
    const data = await OrderService.GetTopProductsBoard();
    new OK({ message: "Top products", data }).send(res);
  }

  static async GetCustomerBoard(req: Request, res: Response) {
    if (!["admin", "manager"].includes(req.user?.role || "")) {
      return new Forbidden({ message: "Bạn không có quyền truy cập dashboard" }).send(res);
    }
    const data = await OrderService.GetCustomerBoard();
    new OK({ message: "Customer board", data }).send(res);
  }

  static async GetPaymentMethodBoard(req: Request, res: Response) {
    if (!["admin", "manager"].includes(req.user?.role || "")) {
      return new Forbidden({ message: "Bạn không có quyền truy cập dashboard" }).send(res);
    }
    const data = await OrderService.GetPaymentMethodBoard();
    new OK({ message: "Payment method board", data }).send(res);
  }
}

export default OrderController;
