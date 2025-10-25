import express from "express";
import { AsyncHandler } from "../utils/async.handler";
import CartController from "../controllers/cart.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  addCartItemSchema,
  updateCartItemSchema,
  shippingDetailsSchema,
  paymentMethodSchema,
  confirmCheckoutSchema
} from "../validators/cart.validator";
import { OptionalAuthenticate } from "../middlewares/optional-auth.middleware";

const router = express.Router();

router.get("/", OptionalAuthenticate, AsyncHandler(CartController.GetCart));

router.post(
  "/items",
  OptionalAuthenticate,
  validate(addCartItemSchema),
  AsyncHandler(CartController.AddItem)
);

router.patch(
  "/items/:itemId",
  OptionalAuthenticate,
  validate(updateCartItemSchema),
  AsyncHandler(CartController.UpdateItem)
);

router.delete(
  "/items/:itemId",
  OptionalAuthenticate,
  AsyncHandler(CartController.RemoveItem)
);

router.post(
  "/checkout/shipping",
  OptionalAuthenticate,
  validate(shippingDetailsSchema),
  AsyncHandler(CartController.SetShipping)
);

router.post(
  "/checkout/payment",
  OptionalAuthenticate,
  validate(paymentMethodSchema),
  AsyncHandler(CartController.SetPayment)
);

router.post(
  "/checkout/confirm",
  OptionalAuthenticate,
  validate(confirmCheckoutSchema),
  AsyncHandler(CartController.ConfirmCheckout)
);

export default router;
