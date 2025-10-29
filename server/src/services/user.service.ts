import { NotFoundError, BadRequestError } from "../core/error.response";
import UserRepo from "../repositories/user.repository";
import bcrypt from "bcrypt";
import User from "../models/user.model";

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

    static async UpdateAddresses(userId: string, addresses: any[]) {
        const user = await UserRepo.findById(userId);
        if (!user) throw new NotFoundError("User not found");

        user.addresses = addresses;
        await user.save();

        return user;
    }

    static async SetBanStatus(userId: string, status: boolean) {
        const user = await UserRepo.findById(userId);
        if (!user) throw new NotFoundError("User not found");

        return await UserRepo.setBanStatus(userId, status);
    }

    static async UpdateAvatar(userId: string, imageUrl: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  user.profileImg = imageUrl;
  await user.save();
  return user;
}

}

export default UserService;
