import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../core/error.response";
import ProductRepo from "../repositories/product.repository";
import CartRepo from "../repositories/cart.repository";
import { ICartIdentifiers, ICart, IShippingAddress, IPaymentMethod, ICartItem, IShippingSelectionPayload, CheckoutStep } from "../interfaces/cart.interface";
import { CartDocument } from "../models/cart.model";
import { getIO } from "../config/socket";
import { IOrder } from "../interfaces/order.interface";
import AddressService from "./address.service";
import { IAddress } from "../interfaces/address.interface";
import DiscountService from "./discount.service";
import OrderService from "./order.service";
import { generateOrderCode } from "../utils/random.helper";
import UserService from "./user.service";
import NotificationService from "./notification.service";
import UserRepo from "../repositories/user.repository";
import LoyaltyService from "./loyalty.service";
import ProductService from "./product.service";

class CartService {
  private static TAX_RATE = 0.1;
  private static SHIPPING_THRESHOLD = 500;
  private static SHIPPING_FEE = 20;

  static async GetCartSummary(identifiers: ICartIdentifiers) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers);
    if (!cart) throw new NotFoundError("Cart not found");
    return this.formatCartResponse(cart, guestId);
  }

  static async AddItem(identifiers: ICartIdentifiers, productId: string, quantity: number) {
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

    this.recordCheckoutStep(cart, "cart");
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

    const { addressId, shippingAddress, contactEmail, shippingName, saveAsNew, setAsDefault } = payload;

    let resolvedShipping: IShippingAddress | null = null;

    // For authenticated user
    if (addressId) {
      if (!identifiers.userId) throw new BadRequestError("addressId chỉ áp dụng cho người dùng đã đăng nhập");
      const address = await AddressService.GetAddressForUser(identifiers.userId, addressId);
      resolvedShipping = this.mapAddressToShipping(address, shippingAddress);

      if (setAsDefault) {
        await AddressService.SetDefaultAddress(identifiers.userId, addressId);
      }
    }

    // For guest user and authenticated user with new address
    if (!resolvedShipping && shippingAddress) {
      // Validate shipping address from client
      this.assertShippingFields(shippingAddress);
      resolvedShipping = { ...shippingAddress };

      // Save new address for authenticated user
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
    if (shippingName !== undefined) {
      cart.shippingName = shippingName;
    }
    this.recordCheckoutStep(cart, "shipping");

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
    this.recordCheckoutStep(cart, "payment");

    await CartRepo.save(cart);
    this.emitCartUpdate(cart);

    return this.formatCartResponse(cart, guestId);
  }

  static async confirmCheckout(identifiers: ICartIdentifiers, points: number = 0) {
    const { cart, guestId } = await this.getOrCreateCart(identifiers, false);
    if (!cart) throw new NotFoundError("Cart not found");
    if (!cart.items.length) throw new BadRequestError("Cart is empty");
    if (!cart.shippingAddress) throw new BadRequestError("Shipping details required");
    if (!cart.paymentMethod) throw new BadRequestError("Payment method required");

    const orderPayload: Partial<IOrder> = {
      orderCode: generateOrderCode(),
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

    orderPayload.points_used = 0;
    orderPayload.points_earned = 0;

    if (cart.user) {
      orderPayload.user = cart.user;
    }

    if (cart.guestId) {
      orderPayload.guestId = cart.guestId;
    }

    if (cart.contactEmail !== undefined) {
      orderPayload.contactEmail = cart.contactEmail;
    }

    const requestedPoints = Number.isFinite(points) ? Math.floor(points) : 0;
    if (requestedPoints < 0) {
      throw new BadRequestError("Invalid loyalty points value");
    }

    const session = await mongoose.startSession();
    let orderResult: any = null;
    let guestUserEmailData: { fullname: string; email: string; tempPassword: string } | null = null;

    try {
      await session.withTransaction(async () => {
        cart.$session(session);

        let loyaltyUser: any = null;

        if (!cart.user && cart.guestId && cart.contactEmail && cart.shippingName) {
          const { user: guestUser, tempPassword } = await UserService.CreateUser(
            {
              fullname: cart.shippingName,
              email: cart.contactEmail
            },
            {
              session,
              skipEmail: true
            }
          );

          cart.user = guestUser._id;
          orderPayload.user = guestUser._id;
          loyaltyUser = guestUser;
          guestUserEmailData = {
            fullname: guestUser.fullname,
            email: guestUser.email,
            tempPassword
          };
        } else if (cart.user) {
          orderPayload.user = cart.user;

          loyaltyUser = await UserRepo.findById(cart.user.toString());
          if (!loyaltyUser) throw new NotFoundError("User not found with cart");
        }

        if (!loyaltyUser && requestedPoints > 0) {
          throw new BadRequestError("Only signed-in users can redeem loyalty points");
        }

        if (loyaltyUser) {
          if (typeof loyaltyUser.$session === "function") {
            loyaltyUser.$session(session);
          }

          const availablePoints = Number(loyaltyUser.loyalty_points ?? 0);
          if (requestedPoints > availablePoints) {
            throw new BadRequestError("Not enough loyalty points");
          }

          const maxRedeemableByTotal = Math.floor(cart.total / 1000);

          if (requestedPoints > maxRedeemableByTotal) {
            throw new BadRequestError("Điểm loyalty vượt quá tổng đơn hàng");
          }

          const redeemedPoints = requestedPoints;
          const discountFromPoints = redeemedPoints * 1000;
          const adjustedTotal = Number(Math.max(cart.total - discountFromPoints, 0).toFixed(2));

          cart.total = adjustedTotal;
          orderPayload.total = adjustedTotal;

          const earnedPoints = Math.floor(adjustedTotal * 0.001); // Because 1.000 VND is 1 point

          loyaltyUser.loyalty_points = availablePoints - redeemedPoints + earnedPoints;
          await loyaltyUser.save({ session });

          orderPayload.points_used = redeemedPoints;
          orderPayload.points_earned = earnedPoints;
        } else {
          cart.total = Number(cart.total.toFixed(2));
          orderPayload.total = cart.total;
        }

        const order = await OrderService.CreateOrder(orderPayload, { session });
        orderResult = order;

        cart.status = "completed";
        this.recordCheckoutStep(cart, "placed");

        if (cart.user) {
          if (order.points_earned > 0) {
            await LoyaltyService.CreateLoyaltyTransaction({
              userId: cart.user.toString(),
              type: "earn",
              points: order.points_earned,
              orderId: order._id.toString()
            });
          }

          if (order.points_used > 0) {
            await LoyaltyService.CreateLoyaltyTransaction({
              userId: cart.user.toString(),
              type: "spend",
              points: order.points_used,
              orderId: order._id.toString()
            });
          }
        }

        await CartRepo.save(cart, { session });

        if (cart.discountCode) {
          const discount = await DiscountService.FindCode(cart.discountCode, session);
          if (discount?._id) {
            await DiscountService.IncrementUsage(discount._id.toString(), session);
          }
        }

        // Increase product solde amount
        if (cart.items.length > 0) {
          await Promise.all(
            cart.items.map(i =>
              ProductService.SoldAmountIncrement(i._id as string, i.quantity, session)
            )
          );
        }
      });
    } finally {
      await session.endSession();
    }

    if (guestUserEmailData) {
      await NotificationService.SendCreatedGuessAccountEmail(guestUserEmailData);
    }

    const normalizedOrder =
      orderResult && typeof orderResult.toObject === "function" ? orderResult.toObject() : orderResult;

    if (normalizedOrder) {
      await this.sendOrderSuccessNotification(normalizedOrder, cart);
    }

    this.emitCartUpdate(cart);

    const orderResponse = normalizedOrder;

    return {
      order: orderResponse,
      cart: this.formatCartResponse(cart, guestId)
    };
  }

  private static recordCheckoutStep(cart: CartDocument, step: CheckoutStep) {
    if (!cart.checkoutTimeline) {
      cart.checkoutTimeline = [] as any;
    }

    const lastEntry = cart.checkoutTimeline[cart.checkoutTimeline.length - 1];
    const now = new Date();

    if (!lastEntry || lastEntry.step !== step) {
      cart.checkoutTimeline.push({ step, time: now } as any);
    } else {
      lastEntry.time = now;
    }
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
        currency: "VND",
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        discountCode: null,
        discountRate: 0,
        discountAmount: 0,
        status: "active",
        checkoutTimeline: [{ step: "cart", time: new Date() }]
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
      checkoutTimeline: cart.checkoutTimeline ?? [],
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

  private static async sendOrderSuccessNotification(order: any, cart: CartDocument) {
    const recipient = await this.resolveOrderRecipient(order);
    if (!recipient?.email) {
      return;
    }

    const shippingAddress = order?.shippingAddress ?? cart?.shippingAddress ?? {};
    const currency = order?.currency ?? cart?.currency ?? "VND";
    const displayName =
      shippingAddress?.fullName ??
      cart?.shippingName ??
      recipient.fullname ??
      "Quý khách";

    const emailPayload = {
      email: recipient.email,
      orderCode: order.orderCode,
      fullName: displayName,
      orderDate: this.formatOrderDate(order?.placedAt),
      orderItems: this.mapOrderItemsForEmail(order?.items ?? [], currency),
      shippingFee: this.formatCurrency(order?.shipping ?? 0, currency),
      tax: this.formatCurrency(order?.tax ?? 0, currency),
      grandTotal: this.formatCurrency(order?.total ?? 0, currency),
      shipName: displayName,
      shipLine1: this.composeAddressLine([shippingAddress?.line1, shippingAddress?.line2]),
      shipCity: this.composeAddressLine([shippingAddress?.city, shippingAddress?.state, shippingAddress?.postalCode]),
      shipCountry: shippingAddress?.country ?? "Việt Nam",
      shipPhone: shippingAddress?.phone ?? "—",
      paymentMethod: this.describePaymentMethod(order?.paymentMethod),
      paymentRef: this.resolvePaymentReference(order?.paymentMethod)
    };

    await NotificationService.SendOrderSuccessEmail(emailPayload);
  }

  private static async resolveOrderRecipient(order: any): Promise<{ email: string; fullname?: string | null } | null> {
    if (order?.contactEmail) {
      const fullName =
        order?.shippingAddress?.fullName ??
        (typeof order?.shippingName === "string" ? order.shippingName : null);
      return { email: order.contactEmail, fullname: fullName };
    }

    const userId =
      typeof order?.user === "string"
        ? order.user
        : order?.user?._id
          ? order.user._id.toString()
          : order?.user
            ? order.user.toString()
            : null;

    if (!userId) {
      return null;
    }

    const user = await UserRepo.findById(userId);
    if (!user) {
      return null;
    }

    return {
      email: user.email,
      fullname: user.fullname ?? null
    };
  }

  private static mapOrderItemsForEmail(items: ICartItem[], currency: string) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => ({
      name: item.product_name,
      variant: item.product_brand ?? null,
      qty: item.quantity,
      total: this.formatCurrency(item.lineTotal ?? 0, currency),
      imageUrl: item.product_img ?? null
    }));
  }

  private static composeAddressLine(parts: Array<string | null | undefined>) {
    return parts.filter((part) => typeof part === "string" && part.trim().length).join(", ") || "—";
  }

  private static describePaymentMethod(paymentMethod: IPaymentMethod | null | undefined) {
    if (!paymentMethod) {
      return "Không rõ phương thức";
    }

    const providerLabel = paymentMethod.provider ? ` - ${paymentMethod.provider}` : "";

    if (paymentMethod.type === "card") {
      return `Thẻ${providerLabel}`.trim();
    } else if (paymentMethod.type === "paypal") {
      return `PayPal${providerLabel}`.trim();
    } else if (paymentMethod.type === "bank_transfer") {
      return `Chuyển khoản ngân hàng${providerLabel}`.trim();
    } else if (paymentMethod.type === "cod") {
      return "Thanh toán khi nhận hàng (COD)";
    }

    return "Không rõ phương thức";
  }

  private static resolvePaymentReference(paymentMethod: IPaymentMethod | null | undefined) {
    return paymentMethod?.transactionId ?? paymentMethod?.note ?? "—";
  }

  private static formatCurrency(amount: number, currency: string) {
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency
      }).format(Number(amount ?? 0));
    } catch {
      return `${Number(amount ?? 0).toFixed(0)} ${currency}`;
    }
  }

  private static formatOrderDate(date: Date | string | null | undefined) {
    const value = date ? new Date(date) : new Date();
    if (Number.isNaN(value.getTime())) {
      return new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    }
    return value.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  }
}

export default CartService;
