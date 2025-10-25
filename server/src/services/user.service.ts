import { NotFoundError, BadRequestError } from "../core/error.response";
import UserRepo from "../repositories/user.repository";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import Address from "../models/address.model";

class UserService {
    static async UpdateInformation(
    userId: string,
    data: { fullname?: string; phone?: string }
  ) {
    const user = await UserRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    if (data.fullname) user.fullname = data.fullname;
    if (data.phone) user.phone = data.phone;

    await user.save();
    return user;
  }

  static async ChangePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await UserRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestError("Old password is incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
  }

  static async ResetPassword(email: string, newPassword: string) {
    const user = await UserRepo.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
  }

  static async AddAddress(userId: string, newAddress: any) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const addressesToAdd = Array.isArray(newAddress) ? newAddress : [newAddress];

    const hasAddress = user.addresses && user.addresses.length > 0;

    const createdAddresses = await Address.insertMany(
      addressesToAdd.map((addr, index) => ({
        ...addr,
        userId,
        isDefault: !hasAddress && index === 0, 
      }))
      
    );

    const addressIds = createdAddresses.map((addr) => addr._id);

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { addresses: { $each: addressIds } } },
      { new: true }
    );

    return createdAddresses;
  }

  static async RemoveAddress(userId: string, addressId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const deleted = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!deleted) throw new NotFoundError("Address not found");

    await User.findByIdAndUpdate(userId, { $pull: { addresses: addressId } });

    if (deleted.isDefault) {
      const anotherAddress = await Address.findOne({ userId });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    return deleted;
  }

  static async SetDefaultAddress(userId: string, addressId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    await Address.updateMany({ userId }, { isDefault: false });
    const updated = await Address.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });

    if (!updated) throw new NotFoundError("Address not found");
    return updated;
  }

  static async ListAddresses(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    return addresses;
  }

  static async SetBanStatus(userId: string, status: boolean) {
    const user = await UserRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    return await UserRepo.setBanStatus(userId, status);
  }}


export default UserService;
