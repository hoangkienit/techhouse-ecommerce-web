import Order from "../models/order.model";
import { IOrder } from "../interfaces/order.interface";
import { ClientSession, SortOrder } from "mongoose";

class OrderRepo {
  static async create(data: Partial<IOrder>, options?: { session?: ClientSession }) {
    const order = new Order(data);
    if (options?.session) {
      order.$session(options.session);
    }
    return order.save();
  }

  static async update(orderId: string, data: Partial<IOrder>) {
    return Order.findByIdAndUpdate(orderId, data, { new: true }).exec();
  }

  static async delete(orderId: string) {
    return Order.findByIdAndDelete(orderId).exec();
  }

  static async findAll(
    filter: Record<string, unknown>,
    page: number,
    limit: number,
    sort: "newest" | "oldest"
  ) {
    const skip = (page - 1) * limit;
    const sortOption: Record<string, SortOrder> = sort === "oldest"
      ? { placedAt: 1 }
      : { placedAt: -1 };

    const [orders, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(limit).sort(sortOption).lean(),
      Order.countDocuments(filter)
    ]);

    return { orders, total };
  }

  static async findById(orderId: string) {
    return Order.findById(orderId)
      .populate("user", "fullname email profile_img")
      .lean();
  }
}

export default OrderRepo;
