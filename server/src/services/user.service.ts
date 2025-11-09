import { NotFoundError, BadRequestError } from "../core/error.response";
import UserRepo from "../repositories/user.repository";
import { generateResetToken, verifyResetToken } from "../utils/tokens.helper";
import { sendEmail } from "../utils/mail.helper";
import { deleteCloudinaryImage, uploadToCloudinary } from "../utils/upload.helper";
import { IUser, IUserQueryOptions } from "../interfaces/user.interface";
import { LOGIN_URL, LOGO_URL, PRIVACY_URL, SUPPORT_URL } from "../constants";
import { generatePassword, generateRandomID } from "../utils/random.helper";
import { HashPassword, VerifyPassword } from "../utils/crypto.handler";
import { ClientSession } from "mongoose";
import NotificationService from "./notification.service";

class UserService {

    static async CreateUser(user: Partial<IUser>, options?: { session?: ClientSession; skipEmail?: boolean }) {

        const tempPassword = generatePassword();
        const hashedPassword = await HashPassword(tempPassword);

        user.password = hashedPassword;

        const newUser = await UserRepo.create(user, options?.session);

        const registrationPayload = {
            fullname: newUser.fullname,
            email: newUser.email,
            tempPassword
        };

        if (!options?.skipEmail) {
            await NotificationService.SendRegistrationEmail(registrationPayload);
        }

        return { user: newUser, tempPassword };
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
        const requestId = generateRandomID(15);
        user.properties = {
            resetToken: token,
            requestId: requestId
        }
        user.markModified("properties");
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset?token=${token}`;

        const payload = {
            requestId: requestId,
            fullname: user.fullname,
            email: user.email,
            resetLink: resetLink,
        }

        await NotificationService.SendResetPasswordEmail(payload);

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
        const payload = {
            requestId: user.properties.requestId ? user.properties.requestId : "null-id",
            fullname: user.fullname,
            email: user.email
        }

        await NotificationService.SendResetPasswordSuccessEmail(payload);

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

    static async GetUserLoyaltyPoints(userId: string) {
        return await UserRepo.getUserLoyaltyPoints(userId);
    }

    static async GetUserList(options: IUserQueryOptions) {
        const { q, page, limit } = options;

        const filter: any = {};

        if (q) {
            filter.$or = [
                { fullname: new RegExp(q, "i") },
                { email: new RegExp(q, "i") },
            ];
        }

        const skip = (page - 1) * limit;

        let {users, total } = await UserRepo.findAll(filter, skip, limit);
        if(users.length > 0){
            users = users.map((u) => ({...u, password: ""}));
        }

        return {
            users,
            total
        }
    }

}

export default UserService;
