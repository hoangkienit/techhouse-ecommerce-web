import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../core/error.response";
import ProductRepo from "../repositories/product.repository";
import CartRepo from "../repositories/cart.repository";
import OrderRepo from "../repositories/order.repository";
import { ICartIdentifiers, ICart, IShippingAddress, IPaymentMethod, ICartItem, IShippingSelectionPayload } from "../interfaces/cart.interface";
import { CartDocument } from "../models/cart.model";
import { getIO } from "../config/socket";
import { IOrder } from "../interfaces/order.interface";
import AddressService from "./address.service";
import { IAddress } from "../interfaces/address.interface";
import DiscountService from "./discount.service";

class CartService {
  private static TAX_RATE = 0.1;
  private static SHIPPING_THRESHOLD = 500;
  private static SHIPPING_FEE = 20;

  static async GetCartSummary(identifiers: ICartIdentifiers) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers);
    if (!cart) throw new NotFoundError("Cart not found");
    return this.formatCartResponse(cart, guestId);
  }

  static async addItem(identifiers: ICartIdentifiers, productId: string, quantity: number) {
    if (quantity <= 0) throw new BadRequestError("Quantity must be greater than zero");

    const product = await ProductRepo.findById(productId);
    if (!product) throw new NotFoundError("Sản phẩm không tồn tại");

    const { cart, guestId } = await this.getOrCreateCart(identifiers);
    if (!cart) throw new NotFoundError("Cart not found");

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.unitPrice = product.product_price;
      existingItem.lineTotal = existingItem.quantity * existingItem.unitPrice;
    } else {
      const newItem: ICartItem = {
        product: product._id,
        product_name: product.product_name,
        product_brand: product.product_brand,
        unitPrice: product.product_price,
        quantity,
        lineTotal: quantity * product.product_price
      };

      const primaryImage = Array.isArray(product.product_imgs) ? product.product_imgs[0] : undefined;
      if (primaryImage) {
        newItem.product_img = primaryImage;
      }

      cart.items.push(newItem);
    }

    cart.checkoutStep = "cart";
    this.recalculateCart(cart);
    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async updateItemQuantity(identifiers: ICartIdentifiers, itemId: string, quantity: number) {
    if (quantity < 0) throw new BadRequestError("Quantity must not be negative");

    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");

    const cartItem = cart.items.find((item) => item._id?.toString() === itemId);
    if (!cartItem) throw new NotFoundError("Cart item not found");

    if (quantity === 0) {
      cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);
    } else {
      cartItem.quantity = quantity;
      cartItem.lineTotal = quantity * cartItem.unitPrice;
    }

    this.recalculateCart(cart);
    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async removeItem(identifiers: ICartIdentifiers, itemId: string) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");

    const prevLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);
    if (cart.items.length === prevLength) throw new NotFoundError("Cart item not found");

    this.recalculateCart(cart);
    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async applyDiscountCode(identifiers: ICartIdentifiers, code: string) {
    const normalizedCode = code?.toUpperCase();
    if (!normalizedCode || !/^[A-Z0-9]{5}$/.test(normalizedCode)) {
      throw new BadRequestError("Mã giảm giá không hợp lệ");
    }

    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");
    if (!cart.items.length) throw new BadRequestError("Cart is empty");

    if (cart.discountCode === normalizedCode) {
      this.recalculateCart(cart);
      await CartRepo.save(cart);
      this.emitCartUpdate(cart);
      return this.formatCartResponse(cart, guestId);
    }

    const discount = await DiscountService.ValidateCode(normalizedCode);

    cart.discountCode = discount.code;
    cart.discountRate = discount.percentage;

    this.recalculateCart(cart);
    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async removeDiscountCode(identifiers: ICartIdentifiers) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");

    cart.discountCode = null;
    cart.discountRate = 0;
    cart.discountAmount = 0;

    this.recalculateCart(cart);
    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async setShippingDetails(
    identifiers: ICartIdentifiers,
    payload: IShippingSelectionPayload
  ) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");
    if (!cart.items.length) throw new BadRequestError("Cart is empty");

    const { addressId, shippingAddress, contactEmail, saveAsNew, setAsDefault } = payload;

    let resolvedShipping: IShippingAddress | null = null;

    if (addressId) {
      if (!identifiers.userId) throw new BadRequestError("addressId chỉ áp dụng cho người dùng đã đăng nhập");
      const address = await AddressService.GetAddressForUser(identifiers.userId, addressId);
      resolvedShipping = this.mapAddressToShipping(address, shippingAddress);

      if (setAsDefault) {
        await AddressService.SetDefaultAddress(identifiers.userId, addressId);
      }
    }

    if (!resolvedShipping && shippingAddress) {
      this.assertShippingFields(shippingAddress);
      resolvedShipping = { ...shippingAddress };

      if (identifiers.userId && saveAsNew) {
        await AddressService.CreateAddress(identifiers.userId, {
          street: shippingAddress.line1!,
          city: shippingAddress.city!,
          state: shippingAddress.state ?? null,
          postalCode: shippingAddress.postalCode ?? null,
          country: shippingAddress.country!,
          label: shippingAddress.fullName ?? null,
          fullName: shippingAddress.fullName ?? null,
          phone: shippingAddress.phone ?? null,
          isDefault: !!setAsDefault
        });
      }
    }

    if (!resolvedShipping) {
      throw new BadRequestError("Thiếu thông tin địa chỉ giao hàng");
    }

    cart.shippingAddress = resolvedShipping;
    if (contactEmail !== undefined) {
      cart.contactEmail = contactEmail;
    }
    cart.checkoutStep = "shipping";

    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async setPaymentMethod(
    identifiers: ICartIdentifiers,
    paymentMethod: IPaymentMethod
  ) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");
    if (!cart.items.length) throw new BadRequestError("Cart is empty");
    if (!cart.shippingAddress) throw new BadRequestError("Shipping details required before payment");

    cart.paymentMethod = paymentMethod;
    cart.checkoutStep = "payment";

    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async confirmCheckout(identifiers: ICartIdentifiers) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");
    if (!cart.items.length) throw new BadRequestError("Cart is empty");
    if (!cart.shippingAddress) throw new BadRequestError("Shipping details required");
    if (!cart.paymentMethod) throw new BadRequestError("Payment method required");

    const orderPayload: Partial<IOrder> = {
      orderCode: nanoid(10).toUpperCase(),
      items: cart.items,
      subtotal: cart.subtotal,
      discountCode: cart.discountCode ?? null,
      discountRate: cart.discountRate ?? 0,
      discountAmount: cart.discountAmount ?? 0,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      currency: cart.currency,
      placedAt: new Date()
    };

    if (cart.user) {
      orderPayload.user = cart.user;
    }

    if (cart.guestId) {
      orderPayload.guestId = cart.guestId;
    }

    if (cart.contactEmail !== undefined) {
      orderPayload.contactEmail = cart.contactEmail;
    }

    const order = await OrderRepo.create(orderPayload);
    cart.status = "completed";
    cart.checkoutStep = "placed";

    await CartRepo.save(cart);

    if (cart.discountCode) {
      const discount = await DiscountService.FindCode(cart.discountCode);
      if (discount?._id) {
        await DiscountService.IncrementUsage(discount._id.toString());
      }
    }

    this.emitCartUpdate(cart);

    return {
      orderCode: order.orderCode,
      total: order.total,
      currency: order.currency,
      cart: this.formatCartResponse(cart, guestId)
    };
  }

  private static async getOrCreateCart(
    identifiers: ICartIdentifiers,
    createIfMissing = true
  ): Promise<{ cart: CartDocument | null; guestId?: string }> {
    const { userId, cartId } = identifiers;
    let cart: CartDocument | null = null;
    let guestId = cartId;

    if (userId) {
      cart = await CartRepo.findActiveByUser(userId);
    } else if (cartId) {
      cart = await CartRepo.findActiveByGuestId(cartId);
    }

    if (!cart && createIfMissing) {
      if (!userId && !guestId) guestId = nanoid(12);

      const payload: Partial<ICart> = {
        currency: "USD",
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        discountCode: null,
        discountRate: 0,
        discountAmount: 0,
        status: "active",
        checkoutStep: "cart"
      };

      if (userId) payload.user = userId;
      if (guestId) payload.guestId = guestId;

      cart = await CartRepo.create(payload);
    }

    if (guestId) {
      return { cart, guestId };
    }

    return { cart };
  }

  private static mapAddressToShipping(address: IAddress, fallback?: IShippingAddress): IShippingAddress {
    const shipping: IShippingAddress = {};

    const fullName = address.fullName ?? fallback?.fullName ?? null;
    if (fullName) shipping.fullName = fullName;

    const line1 = address.street ?? fallback?.line1 ?? null;
    if (line1) shipping.line1 = line1;

    if (fallback?.line2) {
      shipping.line2 = fallback.line2;
    }

    const city = address.city ?? fallback?.city ?? null;
    if (city) shipping.city = city;

    const state = address.state ?? fallback?.state ?? null;
    if (state) shipping.state = state;

    const postalCode = address.postalCode ?? fallback?.postalCode ?? null;
    if (postalCode) shipping.postalCode = postalCode;

    const country = address.country ?? fallback?.country ?? null;
    if (country) shipping.country = country;

    const phone = address.phone ?? fallback?.phone ?? null;
    if (phone) shipping.phone = phone;

    this.assertShippingFields(shipping);
    return shipping;
  }

  private static assertShippingFields(shipping: IShippingAddress) {
    if (!shipping.line1 || !shipping.city || !shipping.country) {
      throw new BadRequestError("Thông tin địa chỉ giao hàng không đầy đủ");
    }

    if (!shipping.fullName || shipping.fullName.trim() === "") {
      shipping.fullName = "Người nhận";
    }
  }

  private static recalculateCart(cart: CartDocument) {
    cart.subtotal = Number(
      cart.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
    );

    if (cart.discountRate && cart.discountRate > 0) {
      cart.discountAmount = Number((cart.subtotal * (cart.discountRate / 100)).toFixed(2));
    } else {
      cart.discountAmount = 0;
      cart.discountRate = 0;
      if (!cart.discountCode) {
        cart.discountCode = null;
      }
    }

    if (cart.discountAmount > cart.subtotal) {
      cart.discountAmount = cart.subtotal;
    }

    const effectiveSubtotal = Math.max(cart.subtotal - cart.discountAmount, 0);

    cart.tax = Number((effectiveSubtotal * this.TAX_RATE).toFixed(2));

    cart.shipping =
      effectiveSubtotal === 0
        ? 0
        : effectiveSubtotal >= this.SHIPPING_THRESHOLD
          ? 0
          : this.SHIPPING_FEE;

    cart.total = Number((effectiveSubtotal + cart.tax + cart.shipping).toFixed(2));
  }

  private static formatCartResponse(cart: CartDocument, guestId?: string) {
    return {
      cartId: cart.guestId ?? guestId ?? null,
      userId: cart.user ? cart.user.toString() : null,
      currency: cart.currency,
      items: cart.items,
      subtotal: cart.subtotal,
      discountCode: cart.discountCode ?? null,
      discountRate: cart.discountRate ?? 0,
      discountAmount: cart.discountAmount ?? 0,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      shippingAddress: cart.shippingAddress ?? null,
      contactEmail: cart.contactEmail ?? null,
      paymentMethod: cart.paymentMethod ?? null,
      checkoutStep: cart.checkoutStep,
      status: cart.status,
      updatedAt: cart.updatedAt
    };
  }

  private static emitCartUpdate(cart: CartDocument) {
    try {
      const io = getIO();
      const targetRoom = cart.user
        ? `cart:user:${cart.user.toString()}`
        : cart.guestId
          ? `cart:guest:${cart.guestId}`
          : null;

      if (targetRoom) {
        io.to(targetRoom).emit("cart:updated", this.formatCartResponse(cart));
      }
    } catch {

    }
  }
}

export default CartService;
