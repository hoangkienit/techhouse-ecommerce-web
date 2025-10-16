import jwt from "jsonwebtoken";
import { IUserPayload } from "../interfaces/jwt.interface";

const generateTokenPair = (payload: IUserPayload) => {
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

export default generateTokenPair;