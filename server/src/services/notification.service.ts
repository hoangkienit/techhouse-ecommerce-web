import { LOGIN_URL, LOGO_URL, PRIVACY_URL, SUPPORT_URL } from "../constants";
import { ICreatedGuessAccountEmail, IOrderSuccess, IResetPasswordSuccessEmail, ISendRegistrationEmail, ISendResetPasswordEmail } from "../interfaces/notification.interface";
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

    static async SendCreatedGuessAccountEmail(payload: ICreatedGuessAccountEmail) {
        await this.sendCreatedGuessAccountEmail(payload);
    }

    static async SendOrderSuccessEmail(payload: IOrderSuccess) {
        await this.sendOrderSuccessEmail(payload);
    }

    static async SendOrderSuccessPreview(recipientEmail: string) {
        const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

        const demoPayload: IOrderSuccess = {
            email: recipientEmail,
            orderCode: "MOCK-ORDER-001",
            fullName: "Khách hàng Techhouse",
            orderDate: now,
            orderItems: [
                {
                    name: "Laptop Gaming GX15",
                    variant: "Intel i9 • 32GB RAM • 1TB SSD",
                    qty: 1,
                    total: "45.990.000 ₫",
                    imageUrl: "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:format(webp):quality(75)/2023_3_9_638139851534926926_msi-gaming-katana-15-b13v-den-1.jpg"
                },
                {
                    name: "Chuột không dây Pro",
                    variant: "Màu đen",
                    qty: 1,
                    total: "890.000 ₫",
                    imageUrl: "https://product.hstatic.net/200000553329/product/hp-wireless-mouse-200_f5e66549ce074119b874a62312f627e9.png"
                }
            ],
            shippingFee: "30.000 ₫",
            tax: "0 ₫",
            grandTotal: "46.920.000 ₫",
            shipName: "Khách hàng Techhouse",
            shipLine1: "123 Đường Demo",
            shipCity: "Quận 1, TP. Hồ Chí Minh",
            shipCountry: "Việt Nam",
            shipPhone: "0123 456 789",
            paymentMethod: "Thanh toán khi nhận hàng (COD)",
            paymentRef: "—"
        };

        await this.SendOrderSuccessEmail(demoPayload);
    }

    //================================================================

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
            'Techhouse | Mật khẩu tạm thời cho tài khoản',
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
            'Techhouse | Đặt lại mật khẩu cho tài khoản',
            'reset-password',
            mailData);
    }

    private static async sendCreatedGuessAccountEmail(
        payload: ICreatedGuessAccountEmail) {
        const mailData = {
            logoUrl: LOGO_URL,
            fullName: payload.fullname,
            userEmail: payload.email,
            tempPassowrd: payload.tempPassword,
            loginUrl: LOGIN_URL,
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL,
            year: new Date().getFullYear(),
        };

        await sendEmail(
            payload.email,
            "Techhouse | Thông tin đăng nhập của bạn",
            "guess-account-created",
            mailData
        );
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
            "Techhouse | Đặt lại mật khẩu thành công",
            "reset-success",
            mailData
        );
    }

    private static async sendOrderSuccessEmail(
        payload: IOrderSuccess) {
        const mailData = {
            logoUrl: LOGO_URL,
            orderCode: payload.orderCode,
            fullName: payload.fullName ?? "Người nhận",
            orderDate: payload.orderDate,
            orderItems: payload.orderItems,
            shippingFee: payload.shippingFee,
            tax: payload.tax,
            grandTotal: payload.grandTotal,
            shipName: payload.shipName,
            shipLine1: payload.shipLine1,
            shipCity: payload.shipCity,
            shipCountry: payload.shipCountry,
            shipPhone: payload.shipPhone ?? null,
            paymentMethod: payload.paymentMethod,
            paymentRef: payload.paymentRef ?? null,
            supportUrl: SUPPORT_URL,
            policyUrl: PRIVACY_URL,
            year: new Date().getFullYear(),
        };

        await sendEmail(
            payload.email,
            "Techhouse | Đặt hàng thành công",
            "order-success",
            mailData
        );
    }
}

export default NotificationService;
