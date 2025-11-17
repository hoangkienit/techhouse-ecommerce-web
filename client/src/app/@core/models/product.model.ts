import { ProductCategory, ProductStatus } from "../enums/products/product.enum";

export interface Product {
    product_name: string;
    product_description: string;
    product_slug: string;
    product_brand: string;
    product_price: number;
    product_imgs: string[];
    product_category: ProductCategory;
    product_attributes: any;
    product_stock: number;
    product_sold_amount: number;
    product_status: ProductStatus;
}