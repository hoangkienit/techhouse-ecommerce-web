import express from "express";
import { Authenticate, AuthorizeAdmin } from "../middlewares/verify.middleware";
import { AsyncHandler } from "../utils/async.handler";
import DiscountController from "../controllers/discount.controller";
import { validate } from "../middlewares/validate.middleware";
import { discountCreateSchema } from "../validators/discount.validator";

const router = express.Router();

/**
 * POST /api/v1/discount
 * @description Tạo mã giảm giá 5 ký tự với phần trăm và giới hạn sử dụng (tối đa 10 lượt)
 * @body code: string (5 ký tự chữ/số)
 * @body description?: string
 * @body percentage: number (1-100)
 * @body usageLimit: number (1-10)
 * @access Admin
 */
router.post(
  "/",
  Authenticate,
  AuthorizeAdmin,
  validate(discountCreateSchema),
  AsyncHandler(DiscountController.Create)
);

/**
 * GET /api/v1/discount
 * @description Lấy danh sách mã giảm giá cùng số lượt dùng và trạng thái hiện tại
 * @query none
 * @access Admin
 */
router.get(
  "/",
  Authenticate,
  AuthorizeAdmin,
  AsyncHandler(DiscountController.List)
);

/**
 * GET /api/v1/discount/public
 * @description Lấy danh sách mã giảm giá đang hoạt động cho người dùng
 * @access Authenticated (hoặc public nếu muốn)
 */
router.get(
  "/public",
  Authenticate,
  AsyncHandler(DiscountController.ListPublic)
);

/**
 * POST /api/v1/discount/deactivate
 * @description Vô hiệu hoá mã giảm giá để ngăn áp dụng cho đơn hàng mới
 * @body code: string
 * @access Admin
 */
router.post("/deactivate",
  Authenticate,
  AuthorizeAdmin,
  AsyncHandler(DiscountController.Deactivate)
);

export default router;
