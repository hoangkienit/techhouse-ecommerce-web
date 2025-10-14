import express from 'express';
import UserController from '../controllers/user.controller';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateInformationSchema } from '../validators/user.validator';
import { asyncHandler } from '../utils/async.handler';

const router = express.Router();

router.post('/add', Authenticate, validate(updateInformationSchema), asyncHandler(UserController.UpdateInformation));

router.patch('/update', Authenticate, validate(updateInformationSchema), asyncHandler(UserController.UpdateInformation));

router.post('/delete', Authenticate, validate(updateInformationSchema), asyncHandler(UserController.UpdateInformation));



export default router;