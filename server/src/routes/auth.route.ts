import express from 'express';
import AuthController from '../controllers/auth.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/login',  asyncHandler(AuthController.Login));

router.post('/register', validate(registerSchema), asyncHandler(AuthController.Register));

// router.get('/logout', asyncHandler(AuthController.Logout));

// router.post('/refresh-token', Authenticate, asyncHandler(AuthController.RefreshToken));

export default router;