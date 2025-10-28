import { Request, Response } from "express";
import CartService from "../services/cart.service";
import { ICartIdentifiers } from "../interfaces/cart.interface";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

class CartController {
  private static resolveIdentifiers(req: Request): ICartIdentifiers {
    const cartIdHeader = req.headers["x-cart-id"];
    const identifiers: ICartIdentifiers = {};

    if (req.user?.userId) {
      identifiers.userId = req.user.userId;
    }

    const cartId =
      (typeof cartIdHeader === "string" ? cartIdHeader : undefined) ??
      (typeof req.body?.cartId === "string" ? req.body.cartId : undefined) ??
      (typeof req.query?.cartId === "string" ? req.query.cartId : undefined);

    if (cartId) {
      identifiers.cartId = cartId;
    }

    return identifiers;
  }

  static async GetCart(req: Request, res: Response) {
    const identifiers = CartController.resolveIdentifiers(req);
    const cart = await CartService.GetCartSummary(identifiers);

    new OK({
      message: "Lấy dữ liệu giỏ hàng thành công",
      data: cart
    }).send(res);
  }

  static async AddItem(req: Request, res: Response) {
    const identifiers = CartController.resolveIdentifiers(req);
    const { productId, quantity } = req.body;

    const cart = await CartService.AddItem(identifiers, productId, Number(quantity ?? 1));

    new OK({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: cart
    }).send(res);
  }

  static async UpdateItem(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity === undefined) throw new BadRequestError("quantity is required");
    if (!itemId) throw new BadRequestError("itemId is required");

    const cart = await CartService.updateItemQuantity(identifiers, itemId, Number(quantity));

    new OK({
      message: "Sản phẩm trong giỏ hàng đã được cập nhật",
      data: cart
    }).send(res);
  }

  static async RemoveItem(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);
    const { itemId } = req.params;
    if (!itemId) throw new BadRequestError("itemId is required");

    const cart = await CartService.removeItem(identifiers, itemId);

    new OK({
      message: "Sản phẩm trong giỏ hàng đã được xoá",
      data: cart
    }).send(res);
  }

  static async ApplyDiscount(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);
    const { code } = req.body;

    const cart = await CartService.applyDiscountCode(identifiers, code);

    new OK({
      message: "Áp dụng mã giảm giá thành công",
      data: cart
    }).send(res);
  }

  static async RemoveDiscount(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);

    const cart = await CartService.removeDiscountCode(identifiers);

    new OK({
      message: "Đã xoá mã giảm giá",
      data: cart
    }).send(res);
  }

  static async SetShipping(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);
    const { shippingAddress, contactEmail, addressId, saveAsNew, setAsDefault } = req.body;

    const cart = await CartService.setShippingDetails(identifiers, {
      shippingAddress,
      contactEmail,
      addressId,
      saveAsNew,
      setAsDefault
    });

    new OK({
      message: "Đã lưu thông tin giao hàng",
      data: cart
    }).send(res);
  }

  static async SetPayment(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);
    const { paymentMethod } = req.body;

    const cart = await CartService.setPaymentMethod(identifiers, paymentMethod);

    new OK({
      message: "Đã lưu phương thức thanh toán",
      data: cart
    }).send(res);
  }

  static async ConfirmCheckout(req: Request, res: Response): Promise<void> {
    const identifiers = CartController.resolveIdentifiers(req);

    const result = await CartService.confirmCheckout(identifiers);

    new OK({
      message: "Đặt hàng thành công",
      data: result
    }).send(res);
  }
}

export default CartController;
