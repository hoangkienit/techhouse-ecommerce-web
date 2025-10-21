
import { IComment } from "../interfaces/review.interface";
import Comment from "../models/comment.model";


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
}

export default ReviewRepo;