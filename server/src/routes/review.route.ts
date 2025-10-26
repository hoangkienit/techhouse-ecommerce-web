import express from 'express';
import { Authenticate } from '../middlewares/verify.middleware';
import { validate } from '../middlewares/validate.middleware';
import { AsyncHandler } from '../utils/async.handler';
import { createCommentSchema, rateProductSchema } from '../validators/review.validator';
import ReviewController from '../controllers/review.controller';
import rateLimit from "express-rate-limit";

const router = express.Router();
const commentLimiter = rateLimit({ windowMs: 60_000, max: 6 });
const ratingLimiter = rateLimit({ windowMs: 60_000, max: 6 });

/**
 * GET /api/v1/review/:productId/comments
 * @description Lấy danh sách bình luận theo sản phẩm
 * @param productId: string
 */
router.get('/:productId/comments',
    AsyncHandler(ReviewController.ListComments));

/**
 * POST /api/v1/review/:productId/comment
 * @description Thêm bình luận mới (không yêu cầu đăng nhập)
 * @param productId: string
 * @body nội dung theo createCommentSchema
 */
router.post('/:productId/comment',
    commentLimiter,
    validate(createCommentSchema),
    AsyncHandler(ReviewController.AddComment));

/**
 * GET /api/v1/review/:productId/ratings
 * @description Lấy danh sách đánh giá (rating) của sản phẩm
 * @param productId: string
 */
router.get('/:productId/ratings',
    AsyncHandler(ReviewController.ListRatings));

/**
 * POST /api/v1/review/:productId/rating
 * @description Gửi đánh giá từ 1-5 sao cho sản phẩm
 * @param productId: string
 * @body rating: number, comment?: string
 * @access Authenticated
 */
router.post('/:productId/rating',
    ratingLimiter,
    Authenticate,
    validate(rateProductSchema),
    AsyncHandler(ReviewController.RateProduct));

export default router;
