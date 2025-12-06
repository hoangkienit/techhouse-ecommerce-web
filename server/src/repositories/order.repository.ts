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

  static async countAll() {
    return Order.countDocuments();
  }

  static async countByAllStatuses() {
    const statuses = ["pending", "confirmed", "paid", "fulfilled", "cancelled"];
    const result: Record<string, number> = {};
    await Promise.all(statuses.map(async s => {
      result[s] = await Order.countDocuments({ status: s });
    }));
    return result;
  }

  static async findLatest(limit: number) {
    return Order.find().sort({ placedAt: -1 }).limit(limit).lean();
  }

  static async findPaidOrders() {
    return Order.find({ status: { $in: ["paid", "fulfilled"] } }).lean();
  }

  static async findTopProducts(limit = 5) {
    return Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product_name", qty: { $sum: "$items.quantity" }, revenue: { $sum: "$items.lineTotal" } } },
      { $sort: { qty: -1 } },
      { $limit: limit }
    ]);
  }

  static async aggregateCustomers() {
    return Order.aggregate([
      { $match: { user: { $ne: null } } },
      { $group: { _id: "$user", totalOrders: { $sum: 1 }, totalSpent: { $sum: "$total" } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);
  }

  static async aggregatePaymentMethods() {
    return Order.aggregate([
      { $group: { _id: "$paymentMethod.type", totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$total" } } },
      { $sort: { totalOrders: -1 } }
    ]);
  }
}

export default OrderRepo;
