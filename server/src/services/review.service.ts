import { NotFoundError } from "../core/error.response";
import { IComment, ICommentListOptions, IRatingListOptions } from "../interfaces/review.interface";
import ProductRepo from "../repositories/product.repository";
import ReviewRepo from "../repositories/review.repository";
import { Types } from 'mongoose';
import { getIO } from './../config/socket';


class ReviewService {
    static async ensureProductExists(productId: string | Types.ObjectId) {
        const product = await ProductRepo.findById(String(productId));
        if (!product) false;
        return true;
    }

    static async ListComments(options: ICommentListOptions) {
        const product = await ProductRepo.findById(options.productId);
        if (!product) throw new NotFoundError("Sản phẩm không tồn tại");

        const page = options.page ?? 1;
        const limit = options.limit ?? 10;
        const skip = (page - 1) * limit;

        return await ReviewRepo.findAllComments(
            options.productId,
            skip,
            options.limit
        );
    }

    static async ListRatings(options: IRatingListOptions) {
        const product = await ProductRepo.findById(options.productId);
        if (!product) throw new NotFoundError("Sản phẩm không tồn tại");

        const page = options.page ?? 1;
        const limit = options.limit ?? 10;
        const skip = (page - 1) * limit;

        return await ReviewRepo.findAllRatings(
            options.productId,
            skip,
            options.limit
        );
    }

    static async AddComment(comment: Partial<IComment>) {
        const product = await this.ensureProductExists(comment.productId as string);
        if (!product) throw new NotFoundError("Sản phẩm không tồn tại");

        const newComment = await ReviewRepo.createComment(comment);

        // Emit socket event
        const io = getIO();
        io.to(`product:${newComment.productId}`).emit('comment:new', {
            _id: newComment._id,
            displayName: newComment.displayName,
            content: newComment.content,
            createdAt: newComment.createdAt,
        });

        return newComment;

    }

    static async RateProduct() {

    }
}

export default ReviewService;