import express from 'express';
import AuthController from '../controllers/auth.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { AsyncHandler } from '../utils/async.handler';
import passport from 'passport';

const router = express.Router();

/**
 * POST /api/v1/auth/login
 * @description Đăng nhập bằng email và mật khẩu
 * @body email: string, password: string
 */
router.post('/login', validate(loginSchema), AsyncHandler(AuthController.Login));

/**
 * POST /api/v1/auth/register
 * @description Đăng ký tài khoản mới cùng địa chỉ giao hàng mặc định
 * @body fullname: string, email: string, password: string, confirmPassword: string, address: object
 */
router.post('/register', validate(registerSchema), AsyncHandler(AuthController.Register));

/**
 * GET /api/v1/auth/logout
 * @description Xoá cookie đăng nhập hiện tại
 */
router.get('/logout', AsyncHandler(AuthController.Logout));

/**
 * POST /api/v1/auth/refresh-token
 * @description Tạo access token mới từ refresh token hợp lệ
 */
router.post('/refresh-token', Authenticate, AsyncHandler(AuthController.RefreshToken));

// GOOGLE
/**
 * GET /api/v1/auth/google
 * @description Chuyển hướng sang Google OAuth (scope email, profile)
 */
router.get('/google', passport.authenticate("google", { scope: ["email", "profile"] }));

/**
 * GET /api/v1/auth/google/callback
 * @description Callback từ Google OAuth, trả về access/refresh token
 */
router.get('/google/callback', passport.authenticate("google", { session: false }), AsyncHandler(AuthController.GoogleCallback));

// FACEBOOK
/**
 * GET /api/v1/auth/test
 * @description Endpoint kiểm tra hoạt động của router (development)
 */
router.get('/test', (req, res) => {
  res.send('Auth route working!');
});

export default router;
