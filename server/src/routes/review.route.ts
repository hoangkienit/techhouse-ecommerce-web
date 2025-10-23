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

router.get('/:productId/comments',
    AsyncHandler(ReviewController.ListComments));

router.post('/:productId/comment',
    commentLimiter,
    validate(createCommentSchema),
    AsyncHandler(ReviewController.AddComment));

router.get('/:productId/ratings',
    AsyncHandler(ReviewController.ListRatings));

router.post('/:productId/rating',
    ratingLimiter,
    Authenticate,
    validate(rateProductSchema),
    AsyncHandler(ReviewController.RateProduct));

export default router;