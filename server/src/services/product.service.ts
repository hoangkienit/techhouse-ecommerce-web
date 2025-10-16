import { BadRequestError, NotFoundError } from "../core/error.response";
import { IAddProduct, IProduct } from "../interfaces/product.interface";
import ProductRepo from "../repositories/product.repository";
import { SlugifyProductName } from "../utils/product.helper";
import { deleteMultipleCloudinaryImages, uploadMultipleToCloudinary } from "../utils/upload.helper";


class ProductService {
    static async AddProduct(product: IAddProduct, files: Express.Multer.File[]) {
        const existed = await ProductRepo.findByName(product.product_name);
        if (existed) throw new BadRequestError("Sản phẩm đã tồn tại");

        // Upload product images to Cloudinary
        const images = await uploadMultipleToCloudinary(files, "products");

        const slugified_name = SlugifyProductName(product.product_name);

        const newProduct = {
            product_name: product.product_name,
            product_description: product.product_description,
            product_slug: slugified_name,
            product_price: product.product_price,
            product_category: product.product_category,
            product_stock: product.product_stock,
            product_attributes: product.product_attributes,
            product_imgs: images
        };

        return await ProductRepo.create(newProduct);
    }

    static async UpdateProduct(productId: string, productData: Partial<IProduct>) {
        const existingProduct = await ProductRepo.findById(productId);
        if (!existingProduct) {
            throw new NotFoundError("Sản phẩm không tồn tại");
        }

        if (productData.product_name) {
            productData.product_slug = SlugifyProductName(productData.product_name);
        }

        // If images are being replaced
        if (productData.product_imgs && !Array.isArray(productData.product_imgs)) {
            throw new BadRequestError("product_imgs phải là mảng URL hình ảnh");
        }
        
        return await ProductRepo.update(productId, productData);
    }

    static async DeleteProduct(productId: string) {
        const product = await ProductRepo.findById(productId);
        if (!product) throw new NotFoundError("Sản phẩm không tồn tại");

        await deleteMultipleCloudinaryImages(product.product_imgs);
        await ProductRepo.deleteById(productId);

        return true;
    }
}

export default ProductService;