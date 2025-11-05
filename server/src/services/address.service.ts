import { BadRequestError, NotFoundError } from "../core/error.response";
import AddressRepo from "../repositories/address.repository";
import { IAddress } from "../interfaces/address.interface";

class AddressService {
  static async GetMyAddresses(userId: string) {
    return AddressRepo.listByUser(userId);
  }

  static async CreateAddress(userId: string, payload: Partial<IAddress>) {
    if (!payload.street || !payload.city || !payload.country) {
      throw new BadRequestError("Địa chỉ không hợp lệ");
    }

    console.log("payload: ", payload);

    return AddressRepo.createForUser(userId, payload);
  }

  static async UpdateAddress(userId: string, addressId: string, payload: Partial<IAddress>) {
    const updated = await AddressRepo.updateForUser(userId, addressId, payload);
    if (!updated) throw new NotFoundError("Địa chỉ không tồn tại");
    return updated;
  }

  static async DeleteAddress(userId: string, addressId: string) {
    const deleted = await AddressRepo.deleteForUser(userId, addressId);
    if (!deleted) throw new NotFoundError("Địa chỉ không tồn tại");
    return deleted;
  }

  static async SetDefaultAddress(userId: string, addressId: string) {
    const updated = await AddressRepo.setDefault(userId, addressId);
    if (!updated) throw new NotFoundError("Địa chỉ không tồn tại");
    return updated;
  }

  static async GetAddressForUser(userId: string, addressId: string) {
    const address = await AddressRepo.findByIdForUser(addressId, userId);
    if (!address) throw new NotFoundError("Địa chỉ không tồn tại");
    return address;
  }
}

export default AddressService;
