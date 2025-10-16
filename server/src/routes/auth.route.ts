import express from 'express';
import AuthController from '../controllers/auth.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { AsyncHandler } from '../utils/async.handler';
import passport from 'passport';

const router = express.Router();

router.post('/login', validate(loginSchema), AsyncHandler(AuthController.Login));

router.post('/register', validate(registerSchema), AsyncHandler(AuthController.Register));

router.get('/logout', AsyncHandler(AuthController.Logout));

router.post('/refresh-token', Authenticate, AsyncHandler(AuthController.RefreshToken));

// GOOGLE
router.get('/google', passport.authenticate("google", { scope: ["email", "profile"] }));

router.get('/google/callback', passport.authenticate("google", { session: false }), AsyncHandler(AuthController.GoogleCallback));

// FACEBOOK

export default router;