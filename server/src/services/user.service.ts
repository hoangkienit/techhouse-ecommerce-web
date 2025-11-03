import { NotFoundError, BadRequestError } from "../core/error.response";
import UserRepo from "../repositories/user.repository";
import { generateResetToken, verifyResetToken } from "../utils/tokens.helper";
import { sendEmail } from "../utils/mail.helper";
import { nanoid } from "nanoid";
import { deleteCloudinaryImage, uploadToCloudinary } from "../utils/upload.helper";
import { IUser } from "../interfaces/user.interface";
import { LOGIN_URL, LOGO_URL, PRIVACY_URL, SUPPORT_URL } from "../constants";
import { generatePassword } from "../utils/random..helper";
import { HashPassword, VerifyPassword } from "../utils/crypto.handler";

class UserService {

    static async CreateUser(user: Partial<IUser>) {

        const tempPassword = generatePassword();
        const hashedPassword = await HashPassword(tempPassword);

        user.password = hashedPassword;

        const newUser = await UserRepo.create(user);

        const mailData = {
            logoUrl: LOGO_URL,
            fullName: newUser.fullname,
            userEmail: newUser.email,
            tempPassword: tempPassword,
            loginUrl: LOGIN_URL,
            year: new Date().getFullYear(),
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL,
        }


        await sendEmail(
            newUser.email,
            'Mật khẩu tạm thời cho tài khoản Techhouse',
            'registration',
            mailData);

        return newUser;
    }
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

        const isMatch = await VerifyPassword(oldPassword, user.password);
        if (!isMatch) throw new BadRequestError("Mật khẩu cũ không đúng");

        user.password = await HashPassword(newPassword);
        await user.save();

        return true;
    }

    static async ResetPassword(email: string) {
        const user = await UserRepo.findByEmail(email);
        if (!user) throw new NotFoundError(`Không tìm thấy tài khoản với email: ${email}`);

        const userPayload = {
            userId: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }
        const token = generateResetToken(userPayload);
        const requestId = nanoid(15);
        user.properties = {
            resetToken: token,
            requestId: requestId
        }
        user.markModified("properties");
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset?token=${token}`;

        const mailData = {
            logoUrl: LOGO_URL,
            requestId: requestId,
            fullName: user.fullname,
            userEmail: user.email,
            resetLink: resetLink,
            tokenTtlHours: 1,
            year: new Date().getFullYear(),
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL
        }

        await sendEmail(
            user.email,
            'Đặt lại mật khẩu cho tài khoản Techhouse',
            'reset-password',
            mailData);

        return true;
    }

    static async ResetPasswordCallback(token: string, newPassword: string) {
        if (!await verifyResetToken(token)) {
            throw new BadRequestError("Token đã hết hạn hoặc không đúng");
        }

        const user = await UserRepo.findByToken(token);
        if (!user) throw new NotFoundError("User not found");

        const hashedPassword = await HashPassword(newPassword);
        user.password = hashedPassword;

        const loginUrl = `${process.env.CLIENT_URL as string}/auth/login`;
        await sendEmail(
            user.email,
            "Đặt lại mật khẩu thành công",
            "reset-success",
            {
                logoUrl: LOGO_URL,
                requestId: user.properties.requestId ? user.properties.requestId : "null-id",
                fullName: user.fullname,
                time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
                loginUrl: loginUrl,
                supportUrl: SUPPORT_URL,
                policyUrl: PRIVACY_URL,
                year: new Date().getFullYear(),
            }
        );
        if (user.properties) {
            user.properties.resetToken = undefined;
            user.properties.requestId = undefined;
            user.markModified("properties");
        }

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

    static async UpdateAvatar(userId: string, file: Express.Multer.File) {
        const user = await UserRepo.findById(userId);
        if (!user) throw new NotFoundError("User not found");

        if (user.profileImg) await deleteCloudinaryImage(user.profileImg);

        const url = await uploadToCloudinary(file, 'avatars');

        user.profileImg = url;

        await user.save();

        return user;
    }


}

export default UserService;
