import { Request, Response } from 'express';
import { CREATED, OK } from '../core/success.response';
import AuthService from '../services/auth.service';
import { BadRequestError, UnauthorizedError } from '../core/error.response';
import { IUserPayload } from '../interfaces/jwt.interface';
import { generateTokenPair } from '../utils/tokens.helper';
import saveTokenToCookie from '../utils/cookie.helper';
import { IsSameSite } from '../utils/setSamesite.helper';

class AuthController {
    static async Login(req: Request, res: Response): Promise<void> {
        const response = await AuthService.Login(req.body);

        // Save tokens to cookie
        saveTokenToCookie(req, response.accessToken, response.refreshToken, res);

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
        const isSameSite = IsSameSite(req.headers.origin);
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: isSameSite ? 'lax' : 'none'
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: isSameSite ? 'lax' : 'none'
        });

        new CREATED({
            message: "Đăng xuất thành công",
            data: {}
        }).send(res);
    }

    static async RefreshToken(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies.refreshToken;
        const isSameSite = IsSameSite(req.headers.origin);

        if (!refreshToken) {
            throw new BadRequestError("Không có refresh token");
        }

        const accessToken = await AuthService.RefreshToken(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: isSameSite ? 'lax' : 'none'
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
        saveTokenToCookie(req, accessToken, refreshToken, res);

        new OK({
            message: "Success",
            data: {}
        }).send(res);

    }
}

export default AuthController;