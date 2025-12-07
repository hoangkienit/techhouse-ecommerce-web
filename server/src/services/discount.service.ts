import { BadRequestError, NotFoundError } from "../core/error.response";
import DiscountRepo from "../repositories/discount.repository";
import { IDiscountCode } from "../interfaces/discount.interface";
import { ClientSession } from "mongoose";

class DiscountService {
  static async CreateCode(payload: Partial<IDiscountCode>, session?: ClientSession) {
    const code = (payload.code ?? "").toUpperCase();

    if (!/^[A-Z0-9]+$/.test(code)) {
      throw new BadRequestError("Mã giảm giá chỉ chứa chữ và số");
    }

    if ((await DiscountRepo.findByCode(code))) {
      throw new BadRequestError("Mã giảm giá đã tồn tại");
    }

    if (!payload.usageLimit || payload.usageLimit < 1 || payload.usageLimit > 10) {
      throw new BadRequestError("Giới hạn sử dụng phải nằm trong khoảng 1-10");
    }

    if (!payload.percentage || payload.percentage < 1 || payload.percentage > 100) {
      throw new BadRequestError("Phần trăm giảm giá phải nằm trong khoảng 1-100");
    }

    return DiscountRepo.create(
      {
        code,
        description: payload.description ?? null,
        percentage: payload.percentage,
        usageLimit: payload.usageLimit,
        createdBy: payload.createdBy ?? null
      },
      session
    );
  }

  static async Deactivate(code: string, session?: ClientSession) {
    const discount = await DiscountRepo.findByCode(code, session);
    if (!discount) throw new NotFoundError("Mã giảm giá không tồn tại");

    return await DiscountRepo.deactivate(discount._id as string, session);
  }

  static async ListCodes() {
    return DiscountRepo.list();
  }

  static async ListActiveCodes() {
    return DiscountRepo.listActive();
  }

  static async ValidateCode(code: string, session?: ClientSession) {
    const discount = await DiscountRepo.findByCode(code, session);
    if (!discount || !discount.isActive) {
      throw new NotFoundError("Mã giảm giá không tồn tại");
    }

    if (discount.usageCount >= discount.usageLimit) {
      throw new BadRequestError("Mã giảm giá đã hết lượt sử dụng");
    }

    return discount;
  }

  static async FindCode(code: string, session?: ClientSession) {
    return DiscountRepo.findByCode(code, session);
  }

  static async IncrementUsage(id: string, session?: ClientSession) {
    await DiscountRepo.incrementUsage(id, session);
  }
}

export default DiscountService;
