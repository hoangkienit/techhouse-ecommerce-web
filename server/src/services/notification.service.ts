import { LOGIN_URL, LOGO_URL, PRIVACY_URL, SUPPORT_URL } from "../constants";
import { IResetPasswordSuccessEmail, ISendRegistrationEmail, ISendResetPasswordEmail } from "../interfaces/notification.interface";
import { sendEmail } from "../utils/mail.helper";


class NotificationService {
    static async SendRegistrationEmail(payload: ISendRegistrationEmail) {
        await this.sendRegistrationEmail(payload);
    }

    static async SendResetPasswordEmail(payload: ISendResetPasswordEmail) {
        await this.sendResetPasswordEmail(payload);
    }

    static async SendResetPasswordSuccessEmail(payload: IResetPasswordSuccessEmail) {
        await this.sendResetPasswordSuccessEmail(payload);
    }

    private static async sendRegistrationEmail(payload: ISendRegistrationEmail) {
        const mailData = {
            logoUrl: LOGO_URL,
            fullName: payload.fullname,
            userEmail: payload.email,
            tempPassword: payload.tempPassword,
            loginUrl: LOGIN_URL,
            year: new Date().getFullYear(),
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL,
        };

        await sendEmail(
            payload.email,
            'Mật khẩu tạm thời cho tài khoản Techhouse',
            'registration',
            mailData
        );
    }

    private static async sendResetPasswordEmail(
        payload: ISendResetPasswordEmail) {
        const mailData = {
            logoUrl: LOGO_URL,
            requestId: payload.requestId,
            fullName: payload.fullname,
            userEmail: payload.email,
            resetLink: payload.resetLink,
            tokenTtlHours: 1,
            year: new Date().getFullYear(),
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL
        }

        await sendEmail(
            payload.email,
            'Đặt lại mật khẩu cho tài khoản Techhouse',
            'reset-password',
            mailData);
    }

    private static async sendResetPasswordSuccessEmail(
        payload: IResetPasswordSuccessEmail) {
        const mailData = {
            logoUrl: LOGO_URL,
            requestId: payload.requestId,
            fullName: payload.fullname,
            time: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
            loginUrl: LOGIN_URL,
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL,
            year: new Date().getFullYear(),
        };

        await sendEmail(
            payload.email,
            "Đặt lại mật khẩu thành công",
            "reset-success",
            mailData
        );
    }
}

export default NotificationService;