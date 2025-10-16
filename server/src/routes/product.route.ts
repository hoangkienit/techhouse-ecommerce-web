import express from 'express';
import { Authenticate, AuthorizeAdmin } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { AsyncHandler } from '../utils/async.handler';
import { addProductSchema } from '../validators/product.validator';
import ProductController from '../controllers/product.controller';
import UploadMiddleware from '../middlewares/upload.middleware';

const router = express.Router();

router.post('/add',
    Authenticate,
    AuthorizeAdmin,
    UploadMiddleware.upload.array('images', 5),
    validate(addProductSchema),
    AsyncHandler(ProductController.AddProduct));

router.patch('/update', Authenticate, AuthorizeAdmin, validate(addProductSchema), AsyncHandler(ProductController.UpdateProduct));

router.post('/delete', Authenticate, AuthorizeAdmin, validate(addProductSchema), AsyncHandler(ProductController.DeleteProduct));



export default router;