import DiscountCode from "../models/discount.model";
import { IDiscountCode } from "../interfaces/discount.interface";
import { ClientSession } from "mongoose";

class DiscountRepo {
  static async create(payload: Partial<IDiscountCode>, session?: ClientSession) {
    const discount = new DiscountCode(payload);
    if (session) {
      discount.$session(session);
    }
    return discount.save();
  }

  static async findByCode(code: string, session?: ClientSession) {
    const query = DiscountCode.findOne({ code: code.toUpperCase() });
    if (session) {
      query.session(session);
    }
    return query.lean();
  }

  static async list() {
    return DiscountCode.find({}).sort({ createdAt: -1 }).lean();
  }

  static async incrementUsage(id: string, session?: ClientSession) {
    const query = DiscountCode.findByIdAndUpdate(
      id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );
    if (session) {
      query.session(session);
    }
    return query.lean();
  }

  static async deactivate(id: string, session?: ClientSession) {
    const query = DiscountCode.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
    if (session) {
      query.session(session);
    }
    return query.lean();
  }
}

export default DiscountRepo;
