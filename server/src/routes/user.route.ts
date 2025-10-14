import express from 'express';
import UserController from '../controllers/user.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateInformationSchema } from '../validators/user.validator';
import { asyncHandler } from '../utils/async.handler';

const router = express.Router();

router.post('/update-information', Authenticate, validate(updateInformationSchema), asyncHandler(UserController.UpdateInformation));

router.post('/change-password', Authenticate, asyncHandler(UserController.ChangePassword));

router.post('/reset-password', Authenticate, asyncHandler(UserController.ResetPassword));

router.post('/update-addresses', Authenticate, asyncHandler(UserController.UpdateAddresses));


export default router;