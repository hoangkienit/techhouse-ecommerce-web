import express from 'express';
import AuthController from '../controllers/auth.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/async.handler';
import passport from 'passport';

const router = express.Router();

router.post('/login', validate(loginSchema), asyncHandler(AuthController.Login));

router.post('/register', validate(registerSchema), asyncHandler(AuthController.Register));

router.get('/logout', asyncHandler(AuthController.Logout));

router.post('/refresh-token', Authenticate, asyncHandler(AuthController.RefreshToken));

// GOOGLE
router.get('/google', passport.authenticate("google", { scope: ["email", "profile"] }));

router.get('/google/callback', passport.authenticate("google", { session: false }), asyncHandler(AuthController.GoogleCallback));

// FACEBOOK

export default router;