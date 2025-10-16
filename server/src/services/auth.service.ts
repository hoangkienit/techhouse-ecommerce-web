
import User from "../models/user.model";
import Address from "../models/address.model";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../core/error.response";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { ILoginRequest, ILoginResponse, IRegisterRequest } from "../interfaces/auth.interface";
import logger from "../config/logger";
import generateTokenPair from "../utils/tokens.helper";

class AuthService {
    private static async checkUserExists(field: string, value: string, errorMsg: string) {
        const exists = await User.findOne({ [field]: value }).lean();
        if (exists) {
            throw new BadRequestError(errorMsg);
        }
    }

    static async Login(
        { email, password }: ILoginRequest,
    ): Promise<ILoginResponse> {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            throw new NotFoundError("Email không tồn tại");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundError('Sai mật khẩu');
        }

        // Generate token pair
        const userPayload = {
            userId: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }
        const { accessToken, refreshToken } = generateTokenPair(userPayload);

        // Remove sensitive fields
        const { password: _, __v, ...safeUser } = user;

        return {
            accessToken,
            refreshToken,
            user: safeUser
        };
    }

    static async Register(
        { fullname, email, password, confirmPassword, address }: IRegisterRequest,
    ): Promise<boolean> {
        // Check for existing username, email, phone
        await this.checkUserExists('email', email, "Email đã tồn tại");

        if (password !== confirmPassword) {
            throw new NotFoundError('Mật khẩu không khớp');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            address: []
        });

        const newAddress = new Address({
            userId: newUser._id,
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            isDefault: true
        });

        await newAddress.save();

        newUser.addresses.push(newAddress._id);

        await newUser.save();

        return true;
    }

    static async RefreshToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET as string
            ) as JwtPayload;


            const newAccessToken = jwt.sign(
                {
                    userId: decoded.userId,
                    fullname: decoded.fullname,
                    role: decoded.role,
                },
                process.env.JWT_ACCESS_SECRET as string,
                {
                    expiresIn: "30m",
                }
            );

            return newAccessToken;
        } catch (error) {
            if (error instanceof Error) {
                logger.error("Failed to fresh token:", error.message);
            }
            throw new UnauthorizedError("Invalid or expired refresh token");
        }
    }
}

export default AuthService;