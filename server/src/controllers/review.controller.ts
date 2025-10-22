import { Request, Response } from "express";
import { NotFoundError } from "../core/error.response";
import ReviewService from "../services/review.service";
import { OK } from "../core/success.response";



class ReviewController {
    static async AddComment(req: Request, res: Response): Promise<void> {

    }

    static async ListComments(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Number(req.query.limit) || 10);

        if(!productId) throw new NotFoundError("Missing credentials");

        const response = await ReviewService.ListComments({productId, page, limit});
        console.log('Response: ', response);

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
    }
}

export default ReviewController;