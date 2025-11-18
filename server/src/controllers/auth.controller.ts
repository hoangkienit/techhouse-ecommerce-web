import { Request, Response } from 'express';
import { CREATED, OK } from '../core/success.response';
import AuthService from '../services/auth.service';
import { BadRequestError, UnauthorizedError } from '../core/error.response';
import { IUserPayload } from '../interfaces/jwt.interface';
import { generateTokenPair } from '../utils/tokens.helper';
import saveTokenToCookie from '../utils/cookie.helper';

class AuthController {
    static async Login(req: Request, res: Response): Promise<void> {
        const response = await AuthService.Login(req.body);

        // Save tokens to cookie
        saveTokenToCookie(response.accessToken, response.refreshToken, res);

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
            sameSite: 'none'
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
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
            sameSite: 'none',
        });

        new OK({
            message: "Refresh token thành công",
            data: {}
        }).send(res);
    }

    static async GoogleCallback(req: Request, res: Response): Promise<void> {
        const user = req.user as IUserPayload;
        if (!user) throw new UnauthorizedError("Unauthorized user!");

        // Generate token pair
        const { accessToken, refreshToken } = generateTokenPair(user);

        // Save tokens to cookie
        saveTokenToCookie(accessToken, refreshToken, res);

        new OK({
            message: "Success",
            data: {}
        }).send(res);

    }
}

export default AuthController;