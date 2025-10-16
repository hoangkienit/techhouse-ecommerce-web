import express from 'express';
import UserController from '../controllers/user.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateInformationSchema } from '../validators/user.validator';
import { AsyncHandler } from '../utils/async.handler';

const router = express.Router();

router.post('/update-information', Authenticate, validate(updateInformationSchema), AsyncHandler(UserController.UpdateInformation));

router.post('/change-password', Authenticate, AsyncHandler(UserController.ChangePassword));

router.post('/reset-password', Authenticate, AsyncHandler(UserController.ResetPassword));

router.post('/update-addresses', Authenticate, AsyncHandler(UserController.UpdateAddresses));


export default router;