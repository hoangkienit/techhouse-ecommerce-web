import { IProduct } from "../interfaces/product.interface";
import Product from "../models/product.model";


class ProductRepo {
    static async create(data: Partial<IProduct>) {
        const product = new Product(data);
        return await product.save();
    }

    static async findById(id: string) {
        return await Product.findById(id).lean();
    }

    static async findByName(name: string) {
        return await Product.findOne({ product_name: name }).lean();
    }

    static async findBySlug(slug: string) {
        return await Product.findOne({ product_slug: slug }).lean();
    }

    static async deleteById(id: string) {
        return await Product.findByIdAndDelete(id);
    }

    static async deleteMany(ids: string[]) {
        return await Product.deleteMany({ _id: { $in: ids } });
    }

    static async update(productId: string, productData: Partial<IProduct>) {
        return Product.findByIdAndUpdate(productId, productData, { new: true }).exec();
    }

    static async findAll(filter = {}, skip = 0, limit = 10, sort: any = { createdAt: -1 }) {
        const [products, total] = await Promise.all([
            Product.find(filter).skip(skip).limit(limit).sort(sort).lean(),
            Product.countDocuments(filter)
        ]);

        return { products, total };
    }
}

export default ProductRepo;