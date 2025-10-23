import { Request, Response } from "express";
import { NotFoundError } from "../core/error.response";
import ReviewService from "../services/review.service";
import { CREATED, OK } from "../core/success.response";
import { HashIP } from "../utils/crypto.handler";
import { Types } from "mongoose";



class ReviewController {
    static async AddComment(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        const userId = req.user?.userId;
        const { content, displayName } = req.body;
        const hashedIP = HashIP(req.ip);

        if (!productId) throw new NotFoundError("Missing productId");

        const response = await ReviewService.AddComment({
            productId: Types.ObjectId.isValid(productId) ? new Types.ObjectId(productId) : productId,
            displayName: displayName,
            content: content,
            userId: userId ? (Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : null) : null,
            ipHash: hashedIP || ""
        });

        new CREATED({
            message: "Thêm comment thành công",
            data: { comment: response }
        }).send(res);
    }

    static async ListComments(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 10);

        if (!productId) throw new NotFoundError("Missing credentials");

        const response = await ReviewService.ListComments({ productId, page, limit });

        new OK({
            message: "Lấy danh sách comment thành công",
            data: {
                comments: response.comments,
                total: response.total,
                page: page
            }
        }).send(res);
    }

    static async RateProduct(req: Request, res: Response): Promise<void> {

    }

    static async ListRatings(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 10);

        if (!productId) throw new NotFoundError("Missing credentials");

        const response = await ReviewService.ListRatings({ productId, page, limit });

        new OK({
            message: "Lấy danh sách rating thành công",
            data: {
                ratings: response.ratings,
                total: response.total,
                page: page
            }
        }).send(res);
    }
}

export default ReviewController;