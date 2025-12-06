import express from "express";
import { Authenticate, AuthorizeAdmin } from "../middlewares/verify.middleware";
import { validate } from "../middlewares/validate.middleware";
import { AsyncHandler } from "../utils/async.handler";
import OrderController from "../controllers/order.controller";
import { updateOrderStatusSchema } from "../validators/order.validator";

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
 * PATCH /api/v1/order/:orderId/status
 * @description Cập nhật trạng thái đơn hàng
 * @body status: "pending" | "confirmed" | "paid" | "fulfilled" | "cancelled"
 * @access Admin
 */
router.patch(
  "/:orderId/status",
  Authenticate,
  AuthorizeAdmin,
  validate(updateOrderStatusSchema),
  AsyncHandler(OrderController.UpdateOrderStatus)
);

/**
 * DELETE /api/v1/order/:orderId
 * @description Xoá đơn hàng của người dùng theo orderId
 * @access Admin
 */
router.delete("/:orderId", Authenticate, AuthorizeAdmin, AsyncHandler(OrderController.DeleteOrder));

router.get("/dashboard", Authenticate, AsyncHandler(OrderController.GetDashboard));
router.get("/revenue", Authenticate, AsyncHandler(OrderController.GetRevenueBoard));
router.get("/top-products", Authenticate, AsyncHandler(OrderController.GetTopProductsBoard));
router.get("/customers", Authenticate, AsyncHandler(OrderController.GetCustomerBoard));
router.get("/payment-methods", Authenticate, AsyncHandler(OrderController.GetPaymentMethodBoard));


export default router;
