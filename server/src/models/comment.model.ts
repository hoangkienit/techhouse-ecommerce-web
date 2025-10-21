import mongoose, { Types } from "mongoose";

const CommentSchema = new mongoose.Schema({
  productId: { type: Types.ObjectId, ref: "Product", index: true, required: true },
  displayName: { type: String, default: "Guest", trim: true, maxlength: 40 },
  content: { type: String, required: true, minlength: 1, maxlength: 2000 },
  // light anti-spam signals
  ipHash: { type: String, index: true },       // hash(IP + secret), not raw IP
  userId: { type: Types.ObjectId, ref: "User" }, // optional (logged-in commenter)
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
