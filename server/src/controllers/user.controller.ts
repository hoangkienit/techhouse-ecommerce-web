import { Request, Response } from "express";
import UserService from "../services/user.service";
import { NotFoundError } from "../core/error.response";
import { OK } from "../core/success.response";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

class UserController {
    static async UpdateInformation(req: Request, res: Response): Promise<void> {
        const userId = req.user?.userId;
        const { fullname, phone } = req.body;

        if (!userId) throw new NotFoundError("User not found");

        const updatedUser = await UserService.UpdateInformation(userId, {
            fullname,
            phone,      
        });

        new OK({
            message: "Thay đổi thông tin thành công",
            data: { updatedUser },
        }).send(res);
    }

    static async ChangePassword(req: Request, res: Response): Promise<void> {
        const userId = req.user?.userId;
        const { oldPassword, newPassword } = req.body;

        if (!userId || !oldPassword || !newPassword)
            throw new NotFoundError("Missing password information");

        await UserService.ChangePassword(userId, oldPassword, newPassword);

        new OK({
            message: "Thay đổi mật khẩu thành công",
            data: {}
        }).send(res);
    }

    static async ResetPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        if (!email)
            throw new NotFoundError("Missing email or password");

        await UserService.ResetPassword(email);

        new OK({
            message: "Đặt lại mật khẩu thành công",
            data: {}
        }).send(res);
    }

    static async ResetPasswordCallback(req: Request, res: Response): Promise<void> {
        const { token } = req.query;
        const { newPassword } = req.body;

        if(!token) throw new NotFoundError("Missing token");

        await UserService.ResetPasswordCallback(token as string, newPassword);

        new OK({
            message: "Đặt lại mật khẩu thành công",
            data: {}
        }).send(res);
    }

    static async UpdateAddresses(req: Request, res: Response): Promise<void> {
        const userId = req.user?.userId;
        const { addresses } = req.body;

        if (!userId) throw new NotFoundError("User not found");
        if (!Array.isArray(addresses))
            throw new NotFoundError("Invalid address format");

        const updatedUser = await UserService.UpdateAddresses(userId, addresses);

        new OK({
            message: "Addresses updated successfully",
            data: { updatedUser },
        }).send(res);
        
    }

    static async SetBanStatus(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId as string;
        const status = req.body.status as boolean;

        if (!userId || status === undefined)
            throw new NotFoundError("Missing credentials");

        const updatedUser = await UserService.SetBanStatus(userId, status);

        new OK({
            message: "Ban status updated successfully",
            data: { updatedUser },
        }).send(res);
    }

static async UpdateAvatar(req: Request, res: Response): Promise<void> {
        const file = req.file as Express.Multer.File;
        const userId = req.user?.userId as string;

        const response = await UserService.UpdateAvatar(userId, file);

    new OK({
      message: "Avatar updated successfully",
      data: {
        newUser : response,
      },
    }).send(res);
  }

}



export default UserController;
