import express from 'express';
import UserController from '../controllers/user.controller';
import { Authenticate, AuthorizeAdmin } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateInformationSchema } from '../validators/user.validator';
import { AsyncHandler } from '../utils/async.handler';
import UploadMiddleware from "../middlewares/upload.middleware";
import rateLimit from "express-rate-limit";

const router = express.Router();
const resetPasswordLimiter = rateLimit({ windowMs: 60_000, max: 4 });

/**
 * POST /api/v1/user/list
 * @description Cập nhật tên và số điện thoại người dùng
 * @query skip: number
 * @query page: number
 * @access Admin
 */
router.get('/list',  AsyncHandler(UserController.GetUserList));

/**
 * POST /api/v1/user/update-information
 * @description Cập nhật tên và số điện thoại người dùng
 * @body fullname?: string, phone?: string
 * @access Authenticated
 */
router.post('/update-information', Authenticate, validate(updateInformationSchema), AsyncHandler(UserController.UpdateInformation));

/**
 * POST /api/v1/user/change-password
 * @description Đổi mật khẩu bằng cách nhập mật khẩu cũ
 * @body oldPassword: string, newPassword: string
 * @access Authenticated
 */
router.post('/change-password', Authenticate, AsyncHandler(UserController.ChangePassword));

/**
 * POST /api/v1/user/reset-password
 * @description Đặt lại mật khẩu theo email đã đăng ký
 * @body email: string
 * @access Guess
 */
router.post('/reset-password', resetPasswordLimiter, AsyncHandler(UserController.ResetPassword));

/**
 * POST /api/v1/user/reset-password-callback
 * @description Đặt lại mật khẩu theo email đã đăng ký
 * @body newPassword: string
 * @query token: string
 * @access Guess
 */
router.post('/reset-password-callback', resetPasswordLimiter, AsyncHandler(UserController.ResetPasswordCallback));

/**
 * POST /api/v1/user/update-addresses
 * @description Ghi đè danh sách địa chỉ đã lưu của người dùng
 * @body addresses: IAddress[]
 * @access Authenticated
 */
router.post('/update-addresses', Authenticate, AsyncHandler(UserController.UpdateAddresses));

/**
 * PATCH /api/v1/user/set-status/:userId
 * @description Khoá hoặc mở khoá tài khoản người dùng
 * @param userId: string
 * @body status: boolean
 * @access Admin
 */
router.patch('/set-status/:userId', Authenticate, AuthorizeAdmin, AsyncHandler(UserController.SetBanStatus));

/**
 * PATCH /api/v1/user/update-avatar
 * @description Đổi ảnh đại diện của người dùng
 * @access Authenticated
 */
router.post('/update-avatar', Authenticate, UploadMiddleware.upload.single('image'), AsyncHandler(UserController.UpdateAvatar));

/**
 * GET /api/v1/user/loyalty-points
 * @description Lấy điểm loyalty của người dùng
 * @access Authenticated
 */
router.post('/loyalty-points', Authenticate, AsyncHandler(UserController.GetUserLoyaltyPoints));

export default router;
