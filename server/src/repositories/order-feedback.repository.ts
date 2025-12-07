import { ClientSession } from "mongoose";
import { IOrderFeedback } from "../interfaces/order-feedback.interface";
import OrderFeedback from "../models/order-feedback.model";

class OrderFeedbackRepo {
  static async create(feedback: IOrderFeedback, session?: ClientSession) {
    const doc = new OrderFeedback(feedback);
    if (session) doc.$session(session);
    return await doc.save();
  }

  static async findByOrder(orderId: string) {
    return OrderFeedback.find({ order: orderId }).sort({ createdAt: -1 }).lean();
  }

  static async findExisting(orderId: string, userId?: string, guestId?: string | null) {
    const query: any = { order: orderId };
    if (userId) query.user = userId;
    else if (guestId) query.guestId = guestId;
    return OrderFeedback.findOne(query).lean();
  }
}

export default OrderFeedbackRepo;
