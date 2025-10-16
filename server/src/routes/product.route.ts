import express from 'express';
import { Authenticate, AuthorizeAdmin } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/async.handler';
import { addProductSchema } from '../validators/product.validator';
import ProductController from '../controllers/product.controller';

const router = express.Router();

router.post('/add', Authenticate, AuthorizeAdmin, validate(addProductSchema), asyncHandler(ProductController.AddProduct));

router.patch('/update', Authenticate, AuthorizeAdmin, validate(addProductSchema), asyncHandler(ProductController.UpdateProduct));

router.post('/delete', Authenticate, AuthorizeAdmin, validate(addProductSchema), asyncHandler(ProductController.DeleteProduct));



export default router;