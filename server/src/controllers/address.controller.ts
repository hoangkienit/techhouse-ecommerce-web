import { Request, Response } from "express";
import AddressService from "../services/address.service";
import { OK } from "../core/success.response";
import { NotFoundError } from "../core/error.response";

class AddressController {
  static async List(req: Request, res: Response) {
    const user = req.user;
    if (!user?.userId) throw new NotFoundError("User not found");
    const userId = user.userId;

    const addresses = await AddressService.GetMyAddresses(userId);
    new OK({
      message: "Lấy danh sách địa chỉ thành công",
      data: { addresses }
    }).send(res);
  }

  static async Create(req: Request, res: Response) {
    const user = req.user;
    if (!user?.userId) throw new NotFoundError("User not found");
    const userId = user.userId;

    const address = await AddressService.CreateAddress(userId, req.body);
    new OK({
      message: "Thêm địa chỉ thành công",
      data: { address }
    }).send(res);
  }

  static async Update(req: Request, res: Response) {
    const user = req.user;
    if (!user?.userId) throw new NotFoundError("User not found");
    const userId = user.userId;

    const addressIdParam = req.params.addressId;
    if (!addressIdParam) throw new NotFoundError("Address not found");
    const address = await AddressService.UpdateAddress(userId, addressIdParam, req.body);
    new OK({
      message: "Cập nhật địa chỉ thành công",
      data: { address }
    }).send(res);
  }

  static async Delete(req: Request, res: Response) {
    const user = req.user;
    if (!user?.userId) throw new NotFoundError("User not found");
    const userId = user.userId;

    const addressIdParam = req.params.addressId;
    if (!addressIdParam) throw new NotFoundError("Address not found");
    await AddressService.DeleteAddress(userId, addressIdParam);
    new OK({
      message: "Xoá địa chỉ thành công",
      data: {}
    }).send(res);
  }

  static async SetDefault(req: Request, res: Response) {
    const user = req.user;
    if (!user?.userId) throw new NotFoundError("User not found");
    const userId = user.userId;

    const addressIdParam = req.params.addressId;
    if (!addressIdParam) throw new NotFoundError("Address not found");
    const address = await AddressService.SetDefaultAddress(userId, addressIdParam);
    new OK({
      message: "Cập nhật địa chỉ mặc định thành công",
      data: { address }
    }).send(res);
  }
}

export default AddressController;
