import { NotFoundError } from "../core/error.response";
import { ICommentListOptions } from "../interfaces/review.interface";
import ProductRepo from "../repositories/product.repository";
import ReviewRepo from "../repositories/review.repository";



class ReviewService {
    static async ListComments(options: ICommentListOptions) {
        const product = await ProductRepo.findById(options.productId);
        if(!product) throw new NotFoundError("Sản phẩm không tồn tại");

        const page = options.page ?? 1;
        const limit = options.limit ?? 10;
        const skip = (page - 1) * limit;

        return await ReviewRepo.findAllComments(
            options.productId,
            skip,
            options.limit
        );
    }

    static async ListRatings() {
        
    }

    static async AddComment() {
        
    }

    static async RateProduct() {
        
    }
}

export default ReviewService;