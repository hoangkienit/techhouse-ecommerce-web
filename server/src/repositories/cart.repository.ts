import Cart, { CartDocument } from "../models/cart.model";
import { ICart } from "../interfaces/cart.interface";

class CartRepo {
  static async create(data: Partial<ICart>) {
    const cart = new Cart(data);
    return cart.save();
  }

  static async findActiveByUser(userId: string): Promise<CartDocument | null> {
    return Cart.findOne({ user: userId, status: "active" });
  }

  static async findActiveByGuestId(guestId: string): Promise<CartDocument | null> {
    return Cart.findOne({ guestId, status: "active" });
  }

  static async findById(cartId: string): Promise<CartDocument | null> {
    return Cart.findById(cartId);
  }

  static async save(cart: CartDocument) {
    return cart.save();
  }
}

export default CartRepo;
