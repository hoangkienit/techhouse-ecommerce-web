import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const Authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            console.log('No access token found in cookies');
            return res.status(401).json({
                message: 'Unauthorized',
                code: 'UNAUTHORIZED'
            });
        }

        // Verify access token
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as any;
        req.user = payload;
        return next();

    } catch (err: any) {
        // Handle expired access token
        if (err.name === 'TokenExpiredError') {
            console.warn('Access token expired, attempting refresh...');

            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                console.log("Missing refresh token");
                return res.status(401).json({
                    message: 'Session expired',
                    code: 'UNAUTHORIZED'
                });
            }

            try {
                // Verify refresh token
                const refreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

                // Generate new access token
                const newAccessToken = jwt.sign(
                    {
                        userId: refreshPayload.userId,
                        username: refreshPayload.username,
                        role: refreshPayload.role,
                    },
                    process.env.JWT_ACCESS_SECRET!,
                    { expiresIn: '30m' }
                );

                // Set new access token cookie
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                });

                req.user = refreshPayload;
                console.log('Access token refreshed successfully');
                return next();

            } catch (refreshErr: any) {
                console.error('Refresh token verification failed:', refreshErr.message);

                // Clear invalid cookies
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');

                return res.status(401).json({
                    message: 'Session expired',
                    code: 'UNAUTHORIZED'
                });
            }
        }

        console.error('JWT verification failed:', err.message);
        return res.status(401).json({
            message: 'Unauthorized',
            code: 'UNAUTHORIZED'
        });
    }
};