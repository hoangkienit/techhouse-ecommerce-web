import { ProductStatus } from "../enums/products/product.enum";

export interface Product {
    product_name: string;               // Tên sản phẩm
    product_description: string;        // Mô tả chi tiết sản phẩm
    product_slug: string;               // Slug dùng cho URL
    product_brand: string;              // Thương hiệu
    product_price: number;              // Giá
    product_imgs: File[];             // Mảng hình sản phẩm (3-4 tấm)
    product_category: string;  // Loại sản phẩm
    product_attributes: ProductAttributes;
    product_stock: number;              // Số lượng tồn kho
    product_sold_amount: number;        // Số lượng đã bán
    product_status: ProductStatus;      // Trạng thái: active/inactive
    short_description?: string;         // Mô tả ngắn, hiển thị trên list
    weight?: string;                    // Trọng lượng sản phẩm
    dimensions?: string;                // Kích thước sản phẩm
    warranty?: string;                  // Thời gian bảo hành
    tags?: string[];                    // Các tag liên quan sản phẩm
}

export interface filterProduct {
    q?: string;
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sort?: string
}

export interface ProductAttributes {
    cpu?: string;
    ram?: string;
    storage?: string;
    screen?: string;
    color?: string;
    battery?: string;
    [key: string]: any;
};