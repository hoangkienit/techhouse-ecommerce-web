
import User from "../models/user.model";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../core/error.response";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { LoginRequest, LoginResponse, RegisterRequest } from "../interfaces/auth.interface";
import logger from "../config/logger";

class AuthService {
    private static async checkUserExists(field: string, value: string, errorMsg: string) {
        const exists = await User.findOne({ [field]: value }).lean();
        if (exists) {
            throw new BadRequestError(errorMsg);
        }
    }

    static async Login(
        { username, password }: LoginRequest,
    ): Promise<LoginResponse> {
        const user = await User.findOne({ username }).lean();
        if (!user) {
            throw new NotFoundError("Tên đăng nhập không tồn tại");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundError('Sai mật khẩu');
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        );

        // Remove sensitive fields
        const { password: _, __v, ...safeUser } = user;

        return {
            accessToken,
            refreshToken,
            user: safeUser
        };
    }

    static async Register(
        { username, email, phone, password, confirmPassword }: RegisterRequest,
    ): Promise<boolean> {
        // Check for existing username, email, phone
        await this.checkUserExists('username', username, "Người dùng đã tồn tại");
        await this.checkUserExists('email', email, "Email đã tồn tại");
        await this.checkUserExists('phone', phone, "Số điện thoại đã tồn tại");

        if (password !== confirmPassword) {
            throw new NotFoundError('Mật khẩu không khớp');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword
        });

        await newUser.save();

        return true;
    }

    static async RefreshToken( refreshToken: string) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET as string
            ) as JwtPayload;

            
            const newAccessToken = jwt.sign(
                {
                    userId: decoded.userId,
                    username: decoded.username,
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