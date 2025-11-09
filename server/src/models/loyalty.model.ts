import mongoose from "mongoose";


const loyaltySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['earn', 'spend'], required: true },
  points: { type: Number, required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

const Loyalty = mongoose.model('Loyalty', loyaltySchema);

export default Loyalty;
