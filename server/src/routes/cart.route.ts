import express from "express";
import { AsyncHandler } from "../utils/async.handler";
import CartController from "../controllers/cart.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  addCartItemSchema,
  updateCartItemSchema,
  shippingDetailsSchema,
  paymentMethodSchema,
  confirmCheckoutSchema,
  applyDiscountSchema
} from "../validators/cart.validator";
import { OptionalAuthenticate } from "../middlewares/optional-auth.middleware";

const router = express.Router();

/**
 * GET /api/v1/cart
 * @description Lấy thông tin giỏ hàng hiện tại (dựa vào cookie user hoặc cartId khách)
 * @query cartId?: string
 */
router.get("/", OptionalAuthenticate, AsyncHandler(CartController.GetCart));

/**
 * POST /api/v1/cart/items
 * @description Thêm sản phẩm vào giỏ hàng hiện tại (khách hoặc user)
 * @body cartId?: string, productId: string, quantity?: number
 */
router.post(
  "/items",
  OptionalAuthenticate,
  validate(addCartItemSchema),
  AsyncHandler(CartController.AddItem)
);

/**
 * PATCH /api/v1/cart/items/:itemId
 * @description Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param itemId: string
 * @body cartId?: string, quantity: number
 */
router.patch(
  "/items/:itemId",
  OptionalAuthenticate,
  validate(updateCartItemSchema),
  AsyncHandler(CartController.UpdateItem)
);

/**
 * DELETE /api/v1/cart/items/:itemId
 * @description Xoá sản phẩm khỏi giỏ hàng
 * @param itemId: string
 */
router.delete(
  "/items/:itemId",
  OptionalAuthenticate,
  AsyncHandler(CartController.RemoveItem)
);

/**
 * POST /api/v1/cart/discount/apply
 * @description Áp dụng mã giảm giá cho giỏ hàng
 * @body cartId?: string, code: string (5 ký tự)
 */
router.post(
  "/discount/apply",
  OptionalAuthenticate,
  validate(applyDiscountSchema),
  AsyncHandler(CartController.ApplyDiscount)
);

/**
 * DELETE /api/v1/cart/discount/remove
 * @description Loại bỏ mã giảm giá khỏi giỏ hàng
 * @query cartId?: string (hoặc gửi trong body)
 */
router.delete(
  "/discount/remove",
  OptionalAuthenticate,
  AsyncHandler(CartController.RemoveDiscount)
);

/**
 * POST /api/v1/cart/checkout/shipping
 * @description Lưu thông tin giao hàng cho giỏ hàng hiện tại
 * @body addressId?: string, shippingAddress?: object, contactEmail?: string, saveAsNew?: boolean, setAsDefault?: boolean
 */
router.post(
  "/checkout/shipping",
  OptionalAuthenticate,
  validate(shippingDetailsSchema),
  AsyncHandler(CartController.SetShipping)
);

/**
 * POST /api/v1/cart/checkout/payment
 * @description Lưu phương thức thanh toán (cần có shipping trước)
 * @body paymentMethod: { type: 'card'|'cod'|'paypal'|'bank_transfer', provider?, last4?, transactionId?, note? }
 */
router.post(
  "/checkout/payment",
  OptionalAuthenticate,
  validate(paymentMethodSchema),
  AsyncHandler(CartController.SetPayment)
);

/**
 * POST /api/v1/cart/checkout/confirm
 * @description Xác nhận đặt hàng, tạo order mới
 * @body cartId?: string
 */
router.post(
  "/checkout/confirm",
  OptionalAuthenticate,
  validate(confirmCheckoutSchema),
  AsyncHandler(CartController.ConfirmCheckout)
);

export default router;
