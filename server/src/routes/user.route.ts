import express from 'express';
import UserController from '../controllers/user.controller';
import { Authenticate, AuthorizeAdmin } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateInformationSchema } from '../validators/user.validator';
import { AsyncHandler } from '../utils/async.handler';
import UploadMiddleware from "../middlewares/upload.middleware";

const router = express.Router();

router.post('/update-information', Authenticate, validate(updateInformationSchema), AsyncHandler(UserController.UpdateInformation));

router.post('/change-password', Authenticate, AsyncHandler(UserController.ChangePassword));

router.post('/reset-password', Authenticate, AsyncHandler(UserController.ResetPassword));

router.post('/update-addresses', Authenticate, AsyncHandler(UserController.UpdateAddresses));

router.patch('/set-status/:userId', Authenticate, AuthorizeAdmin, AsyncHandler(UserController.SetBanStatus));

router.post(
  "/update-avatar",
  Authenticate,
  UploadMiddleware.upload.single("avatar"),
  AsyncHandler(UserController.UpdateAvatar)
);

export default router;