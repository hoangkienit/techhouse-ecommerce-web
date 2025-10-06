import { Request, Response } from 'express';
import { CREATED, OK } from '../core/success.response';
import AuthService from '../services/auth.service';
import { BadRequestError } from '../core/error.response';

class AuthController {
    static async Login(req: Request, res: Response): Promise<void> {
        const response = await AuthService.Login(req.body);     
        res.cookie("accessToken", response.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        res.cookie("refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        new OK({
            message: 'Đăng nhập thành công',
            data: {
                user: response.user
            }
        }).send(res);
    }

    static async Register(req: Request, res: Response): Promise<void> {
        await AuthService.Register(req.body);
        
        new CREATED({
            message: "Đăng ký thành công",
            data: {}
        }).send(res);
    }

    static async Logout(req: Request, res: Response): Promise<void> {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        new CREATED({
            message: "Đăng xuất thành công",
            data: {}
        }).send(res);
    }

    static async RefreshToken(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new BadRequestError("Không có refresh token");
        }

        const accessToken = await AuthService.RefreshToken(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        new OK({
            message: "Refresh token thành công",
            data: {}
        }).send(res);
    }
}

export default AuthController;