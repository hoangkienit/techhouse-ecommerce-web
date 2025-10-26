import Address from "../models/address.model";
import User from "../models/user.model";
import { IAddress } from "../interfaces/address.interface";
import { Types } from "mongoose";

class AddressRepo {
  static async listByUser(userId: string) {
    return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
  }

  static async findByIdForUser(addressId: string, userId: string) {
    if (!Types.ObjectId.isValid(addressId)) return null;
    return Address.findOne({ _id: addressId, userId }).lean();
  }

  static async createForUser(userId: string, payload: Partial<IAddress>) {
    if (payload.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = new Address({
      ...payload,
      userId
    });

    const saved = await address.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { addresses: saved._id }
    });

    return saved.toObject();
  }

  static async updateForUser(userId: string, addressId: string, payload: Partial<IAddress>) {
    if (payload.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { $set: payload },
      { new: true }
    ).lean();

    return updated;
  }

  static async deleteForUser(userId: string, addressId: string) {
    const address = await Address.findOneAndDelete({ _id: addressId, userId }).lean();
    if (address) {
      await User.findByIdAndUpdate(userId, {
        $pull: { addresses: addressId }
      });
    }
    return address;
  }

  static async setDefault(userId: string, addressId: string) {
    const existing = await Address.findOne({ _id: addressId, userId });
    if (!existing) return null;

    await Address.updateMany({ userId }, { isDefault: false });
    const updated = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    ).lean();

    return updated;
  }
}

export default AddressRepo;
