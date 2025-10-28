import { NotFoundError, BadRequestError } from "../core/error.response";
import UserRepo from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { generateResetToken, verifyResetToken } from "../utils/tokens.helper";
import path from 'path';
import fs from 'fs';
import { sendEmail } from "../utils/mail.helper";

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
        if (!isMatch) throw new BadRequestError("Mật khẩu cũ không đúng");

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return true;
    }

    static async ResetPassword(email: string) {
        const user = await UserRepo.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        const userPayload = {
            userId: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }
        const token = generateResetToken(userPayload);
        user.properties = {
            resetToken: token
        }
        user.markModified("properties");
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
        const templatePath = path.join(__dirname, '../templates/forgot_password.html');

        const html = fs.readFileSync(templatePath, 'utf8').replace('{{RESET_LINK}}', resetLink);

        await sendEmail(user.email, 'Đặt lại mật khẩu cho tài khoản Techhouse', html);

        return true;
    }

    static async ResetPasswordCallback(token: string, newPassword: string) {
        if(!await verifyResetToken(token)) {
            throw new BadRequestError("Token đã hết hạn hoặc không đúng");
        }

        const user = await UserRepo.findByToken(token);
        if(!user) throw new NotFoundError("User not found");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.properties.resetToken = undefined;

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
}

export default UserService;
