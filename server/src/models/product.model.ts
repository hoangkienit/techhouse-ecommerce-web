
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_slug: { 
        type: String, 
        required: true, 
    },
    product_price: {
        type: String,
        required: true
    },
    product_imgs: [{ type: String, required: true }],
    product_category: {
        type: String,
        enum: ["laptop", "phone", "tablet", "computer"],
        required: true
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    product_stock: { type: Number, default: 0, required: true },
    product_sold_amount: { type: Number, default: 0 },
    product_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;