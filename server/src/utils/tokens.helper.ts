import jwt from "jsonwebtoken";
import { IUserPayload } from "../interfaces/jwt.interface";

export const generateTokenPair = (payload: IUserPayload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '30m' }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
    );

    return {
        accessToken,
        refreshToken
    }
}

export const generateResetToken = (payload: any) => {
    return jwt.sign(
        payload,
        process.env.JWT_RESET_SECRET as string,
        { expiresIn: '1h' }
    );
}

export const verifyResetToken = (token: string) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_RESET_SECRET!) as any; 

        if(payload) return payload;
    } catch (error) {
        return false;
    }
}
