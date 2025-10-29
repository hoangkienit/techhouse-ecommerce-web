
import { BadRequestError, NotFoundError, UnauthorizedError } from "../core/error.response";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ILoginRequest, ILoginResponse, IRegisterRequest } from "../interfaces/auth.interface";
import logger from "../config/logger";
import UserRepo from "../repositories/user.repository";
import { generateTokenPair } from "../utils/tokens.helper";
import { generatePassword } from "../utils/random..helper";
import { HashPassword, VerifyPassword } from "../utils/crypto.handler";
import path from 'path';
import fs from 'fs';
import { sendEmail } from "../utils/mail.helper";

class AuthService {
    static async Login(
        { email, password }: ILoginRequest,
    ): Promise<ILoginResponse> {
        const user = await UserRepo.findByEmail(email);
        if (!user) {
            throw new NotFoundError("Email không tồn tại");
        }

        const isPasswordValid = await VerifyPassword(password, user.password);
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
        { fullname, email, address }: IRegisterRequest,
    ): Promise<boolean> {
        // Check for existing email
        if (await UserRepo.findByEmail(email)) throw new BadRequestError("Email đã tồn tại");

        const tempPassword = generatePassword();
        const hashedPassword = await HashPassword(tempPassword);

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

        const loginUrl = `${process.env.CLIENT_URL as string}/auth/login`;

        const mailData = {
            logoUrl: "https://cdn.techhouse.vn/logo.png",
            fullName: newUser.fullname,
            userEmail: newUser.email,
            tempPassword: tempPassword,
            loginUrl: loginUrl,
            year: new Date().getFullYear(),
            supportUrl: "https://techhouse.vn/support",
            policyUrl: "https://techhouse.vn/privacy",
        }


        await sendEmail(
            email, 
            'Mật khẩu tạm thời cho tài khoản Techhouse', 
            'registration', 
            mailData);

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
