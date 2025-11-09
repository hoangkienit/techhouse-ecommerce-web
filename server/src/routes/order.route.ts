import express from "express";
import { Authenticate, AuthorizeAdmin } from "../middlewares/verify.middleware";
import { AsyncHandler } from "../utils/async.handler";
import OrderController from "../controllers/order.controller";

const router = express.Router();


/**
 * GET /api/v1/order/:orderId
 * @description Lấy chi tiết đơn hàng (kèm danh sách sản phẩm, địa chỉ, trạng thái)
 * @param orderId: string
 * @access Authenticated (chủ sở hữu hoặc admin)
 */
router.get("/:orderId", Authenticate, AsyncHandler(OrderController.GetOrderDetail));

/**
 * GET /api/v1/order
 * @description Lấy danh sách đơn hàng theo người dùng (hoặc lọc theo trạng thái)
 * @query status?: string (chuỗi trạng thái cách nhau bởi dấu phẩy)
 * @query sort?: \"newest\" | \"oldest\"
 * @query page?: number
 * @query limit?: number
 * @query userId?: string (chỉ admin/manager sử dụng)
 * @query guestId?: string
 * @access Authenticated
 */
router.get("/", Authenticate, AsyncHandler(OrderController.GetOrders));

/**
 * DELETE /api/v1/order
 * @description Xoá đơn hàng của người dùng theo orderId
 * @param orderId: string

 * @access Admin
 */
router.delete("/:orderId", Authenticate, AuthorizeAdmin, AsyncHandler(OrderController.DeleteOrder));

export default router;
