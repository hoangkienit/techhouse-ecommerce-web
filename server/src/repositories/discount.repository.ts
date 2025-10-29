import DiscountCode from "../models/discount.model";
import { IDiscountCode } from "../interfaces/discount.interface";

class DiscountRepo {
  static async create(payload: Partial<IDiscountCode>) {
    const discount = new DiscountCode(payload);
    return discount.save();
  }

  static async findByCode(code: string) {
    return DiscountCode.findOne({ code: code.toUpperCase() }).lean();
  }

  static async list() {
    return DiscountCode.find({}).sort({ createdAt: -1 }).lean();
  }

  static async incrementUsage(id: string) {
    return DiscountCode.findByIdAndUpdate(
      id,
      { $inc: { usageCount: 1 } },
      { new: true }
    ).lean();
  }

  static async deactivate(id: string) {
    return DiscountCode.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    ).lean();
  }
}

export default DiscountRepo;
