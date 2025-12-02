import { Response } from 'express';
import { IsSameSite } from './setSamesite.helper';


const saveTokenToCookie = (req: any, accessToken: string, refreshToken: string, res: Response) => {
    const isSameSite = IsSameSite(req.headers.origin);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: isSameSite ? 'lax' : 'none',
        maxAge: 30 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: isSameSite ? 'lax' : 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export default saveTokenToCookie;