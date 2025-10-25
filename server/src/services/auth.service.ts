
import { BadRequestError, NotFoundError, UnauthorizedError } from "../core/error.response";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { ILoginRequest, ILoginResponse, IRegisterRequest } from "../interfaces/auth.interface";
import logger from "../config/logger";
import generateTokenPair from "../utils/tokens.helper";
import UserRepo from "../repositories/user.repository";

class AuthService {
    static async Login(
        { email, password }: ILoginRequest,
    ): Promise<ILoginResponse> {
        const user = await UserRepo.findByEmail(email);
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
        // Check for existing email
        if(await UserRepo.findByEmail(email)) throw new BadRequestError("Email đã tồn tại");

        if (password !== confirmPassword) {
            throw new BadRequestError('Mật khẩu không khớp');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepo.create({
            fullname: fullname,
            email: email,
            password: hashedPassword
        });

        const initialAddress: {
            street: string;
            city: string;
            state?: string;
            postalCode?: string;
            country: string;
            label?: string;
            fullName?: string;
            phone?: string;
            isDefault?: boolean;
        } = {
            street: address.street,
            city: address.city,
            country: address.country,
            isDefault: true
        };

        if (address.state) initialAddress.state = address.state;
        if (address.postalCode) initialAddress.postalCode = address.postalCode;
        if (address.label) initialAddress.label = address.label;
        if (address.fullName) initialAddress.fullName = address.fullName;
        if (address.phone) initialAddress.phone = address.phone;

        await UserRepo.addAddress(newUser._id.toString(), initialAddress);

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
