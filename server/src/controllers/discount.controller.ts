import { Request, Response } from "express";
import { CREATED, OK } from "../core/success.response";
import DiscountService from "../services/discount.service";
import { NotFoundError } from "../core/error.response";

class DiscountController {
  static async Create(req: Request, res: Response): Promise<void> {
    const admin = req.user;
    if (!admin?.userId) throw new NotFoundError("User not found");

    const discount = await DiscountService.CreateCode({
      ...req.body,
      createdBy: admin.userId
    });

    new CREATED({
      message: "Tạo mã giảm giá thành công",
      data: { discount }
    }).send(res);
  }

  static async List(req: Request, res: Response): Promise<void> {
    const discounts = await DiscountService.ListCodes();
    new OK({
      message: "Lấy danh sách mã giảm giá thành công",
      data: { discounts }
    }).send(res);
  }

  static async Deactivate(req: Request, res: Response): Promise<void> {
    const { code } = req.body;
    const admin = req.user;
    if (!admin?.userId) throw new NotFoundError("User not found");
    if(!code) throw new NotFoundError("Code not found");

    await DiscountService.Deactivate(code);

    new OK({
      message: "Vô hiệu hoá mã giảm giá thành công",
      data: {}
    }).send(res);
  }
}

export default DiscountController;
