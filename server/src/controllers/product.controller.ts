import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../core/error.response";
import ProductService from "../services/product.service";
import { UploadedFilesArray } from "../types/multer";
import { IAddProduct, IProductQueryOptions } from "../interfaces/product.interface";
import { CREATED, OK } from "../core/success.response";


class ProductController {
    static async AddProduct(req: Request, res: Response): Promise<void> {
        const files = req.files as UploadedFilesArray;
        const product = req.body as IAddProduct;

        // Checking product image upload
        if (!files || Array.isArray(files) && files.length === 0) {
            throw new BadRequestError('Cần ít nhất 1 ảnh cho sản phẩm');
        }

        if (Array.isArray(files) && files.length > 5) {
            throw new BadRequestError("Bạn có thể tải lên tối đa 5 ảnh sản phẩm");
        }

        const newProduct = await ProductService.AddProduct(product, files);

        new CREATED({
            message: "Thêm sản phẩm thành công",
            data: {
                newProduct: newProduct
            }
        }).send(res);
    }

    static async UpdateProduct(req: Request, res: Response): Promise<void> {
        const productId = req.params.productId as string;
        const productData = req.body;

        if (!productId) throw new NotFoundError("Missing credentials");

        const updatedProduct = await ProductService.UpdateProduct(productId, productData);

        new CREATED({
            message: "Cập nhật sản phẩm thành công",
            data: {
                updatedProduct
            }
        }).send(res);
    }

    static async DeleteProduct(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        if (!productId) throw new NotFoundError("Missing credentials");

        await ProductService.DeleteProduct(productId);

        new OK({
            message: "Xoá sản phẩm thành công",
            data: {}
        }).send(res);
    }

    static async AllProducts(req: Request, res: Response): Promise<void> {
        const { q, brand, category, minPrice, maxPrice, minRating, sort, page, limit } = req.query;

        const response = await ProductService.AllProducts({
            q: q ? String(q) : undefined,
            brand: brand ? String(brand) : undefined,
            category: category ? String(category) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            minRating: minRating ? Number(minRating) : undefined,
            sort: sort ? String(sort) : undefined,
            page: Number(page),
            limit: Number(limit)
        });

        new OK({
            message: "Lấy danh sách sản phẩm thành công",
            data: {
                products: response.products,
                page: Number(page),
                total: response.total
            }
        }).send(res);
    }

    static async GetSingleProduct(req: Request, res: Response): Promise<void> {
        const { productId } = req.params;
        if (!productId) throw new NotFoundError("Missing credentials");

        const response = await ProductService.GetSingleProduct(productId);

        new OK({
            message: "Lấy sản phẩm thành công",
            data: {
                product: response
            }
        }).send(res);
    }
}

export default ProductController;