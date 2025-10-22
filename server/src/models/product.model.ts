
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
        default: ""
    },
    product_brand: { 
        type: String, 
        required: true, 
        index: true
    },
    product_price: {
        type: Number,
        required: true,
        index: true
    },
    product_imgs: [{ type: String, required: true }],
    product_category: {
        type: String,
        enum: ["laptop", "phone", "tablet", "computer"],
        required: true,
        index: true
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    },
    product_stock: { type: Number, default: 0 },
    product_sold_amount: { type: Number, default: 0 },
    product_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
}, {
    timestamps: true
});

productSchema.index({ product_name: "text", product_brand: "text", product_category: "text", product_description: "text" });
productSchema.index({ product_category: 1, product_brand: 1, product_price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;