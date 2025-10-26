
import { IComment, IRating } from "../interfaces/review.interface";
import Comment from "../models/comment.model";
import Rating from "../models/rating.model";


class ReviewRepo {
    // ==============COMMENT===============
    static async createComment(data: Partial<IComment>) {
        const comment = new Comment(data);
        return await comment.save();
    }

    static async findCommentById(id: string) {
        return await Comment.findById(id).lean();
    }

    static async deleteCommentById(id: string) {
        return await Comment.findByIdAndDelete(id);
    }

    static async deleteManyComment(ids: string[]) {
        return await Comment.deleteMany({ _id: { $in: ids } });
    }

    static async updateComment(commentId: string, commentData: Partial<IComment>) {
        return Comment.findByIdAndUpdate(commentId, commentData, { new: true }).exec();
    }

    static async findAllComments(productId: string, skip = 0, limit = 10) {
        const [comments, total] = await Promise.all([
            Comment.find({ productId }).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
            Comment.countDocuments({ productId })
        ]);

        return { comments, total };
    }

    // ==============RATING===============
    static async createRating(data: Partial<IRating>) {
        const rating = new Rating(data);
        return await rating.save();
    }

    static async findRatingById(id: string) {
        return await Rating.findById(id).lean();
    }

    static async deleteRatingById(id: string) {
        return await Rating.findByIdAndDelete(id);
    }

    static async deleteManyRating(ids: string[]) {
        return await Rating.deleteMany({ _id: { $in: ids } });
    }

    static async updateRating(commentId: string, commentData: Partial<IRating>) {
        return Rating.findByIdAndUpdate(commentId, commentData, { new: true }).exec();
    }

    static async findAllRatings(productId: string, skip = 0, limit = 10) {
        const [ratings, total] = await Promise.all([
            Rating.find({ productId }).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
            Rating.countDocuments({ productId })
        ]);

        return { ratings, total };
    }
}

export default ReviewRepo;