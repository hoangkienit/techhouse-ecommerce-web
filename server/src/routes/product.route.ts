import express from 'express';
import { Authenticate, AuthorizeAdmin } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { AsyncHandler } from '../utils/async.handler';
import { addProductSchema, productQuerySchema } from '../validators/product.validator';
import ProductController from '../controllers/product.controller';
import UploadMiddleware from '../middlewares/upload.middleware';

const router = express.Router();

/**
 * POST /api/v1/product/add
 * @description Thêm sản phẩm mới kèm tối đa 5 ảnh
 * @formdata images[]: file, product_* fields theo addProductSchema
 * @access Admin
 */
router.post('/add',
    Authenticate,
    AuthorizeAdmin,
    UploadMiddleware.upload.array('images', 5),
    validate(addProductSchema),
    AsyncHandler(ProductController.AddProduct));

/**
 * PATCH /api/v1/product/update/:productId
 * @description Cập nhật thông tin sản phẩm
 * @param productId: string
 * @body các trường hợp lệ theo addProductSchema
 * @access Admin
 */
router.patch('/update/:productId',
    Authenticate,
    AuthorizeAdmin,
    AsyncHandler(ProductController.UpdateProduct));

/**
 * POST /api/v1/product/delete
 * @description Xoá sản phẩm theo id
 * @body productId: string
 * @access Admin
 */
router.post('/delete/:productId',
    Authenticate,
    AuthorizeAdmin,
    AsyncHandler(ProductController.DeleteProduct));

/**
 * GET /api/v1/product/list/:productId
 * @description Lấy chi tiết sản phẩm
 * @param productId: string
 */
router.get('/list/:productId',
    AsyncHandler(ProductController.GetSingleProduct));

/**
 * GET /api/v1/product/list
 * @description Liệt kê sản phẩm với tìm kiếm, lọc, phân trang
 * @query q?, brand?, category?, minPrice?, maxPrice?, sort?, page?, limit?
 */
router.get('/list',
    validate(productQuerySchema),
    AsyncHandler(ProductController.AllProducts));


export default router;
