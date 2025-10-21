import { Request, Response } from "express";
import UserService from "../services/user.service";
import { use } from "passport";
import { NotFoundError } from "../core/error.response";
import { OK } from "../core/success.response";


class UserController {
    static async UpdateInformation(req: Request, res: Response): Promise<void> {

    }

    static async ChangePassword(req: Request, res: Response): Promise<void> {

    }

    static async ResetPassword(req: Request, res: Response): Promise<void> {

    }

    static async UpdateAddresses(req: Request, res: Response): Promise<void> {
        
    }

    static async SetBanStatus(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId as string;
        const status = req.body.status as boolean;

        if(!userId || !status) throw new NotFoundError("Missing credentials");

        const updatedUser = await UserService.SetBanStatus(userId, status);

        new OK({
            message: "Cập nhật thành công",
            data: { updatedUser }
        }).send(res);

    }
}

export default UserController;