import mongoose, { Types } from "mongoose";

const RatingSchema = new mongoose.Schema({
  productId: { type: Types.ObjectId, ref: "Product", index: true, required: true },
  userId: { type: Types.ObjectId, ref: "User", index: true, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

RatingSchema.index({ productId: 1, userId: 1 }, { unique: true }); // enforce 1 rating per user
const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;
