import { Request, Response } from "express";
import UserService from "../services/user.service";
import { NotFoundError } from "../core/error.response";
import { OK } from "../core/success.response";
import Address from "../models/address.model";

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
            message: "Information updated successfully",
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
            message: "Password changed successfully",
        }).send(res);
    }

    static async ResetPassword(req: Request, res: Response): Promise<void> {
        const { email, newPassword } = req.body;

        if (!email || !newPassword)
            throw new NotFoundError("Missing email or password");

        await UserService.ResetPassword(email, newPassword);

        new OK({
            message: "Password reset successfully",
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
}

export default UserController;
