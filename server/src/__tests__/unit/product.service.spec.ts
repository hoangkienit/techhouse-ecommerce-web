// tests/unit/auth.service.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../models/product.model";
import ProductService from "../../services/product.service";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    process.env.JWT_ACCESS_SECRET = "test_access_secret";
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Product.deleteMany({});
});

describe("ProductService - AllProducts", () => {
    beforeEach(async () => {
        await Product.insertMany([{
            product_name: "MacBook Pro 2025",
            product_description: "Apple MacBook Pro with M5 Chip, 32GB RAM, 1TB SSD",
            product_slug: "macbook-pro-2025",
            product_brand: "Apple",
            product_price: "2999",
            product_imgs: [
                "https://example.com/images/macbook-front.jpg",
                "https://example.com/images/macbook-back.jpg"
            ],
            product_category: "laptop",
            product_attributes: {
                cpu: "Apple M5",
                ram: "32GB",
                storage: "1TB SSD",
                screen: "14-inch MiniLED",
                color: "Space Gray"
            },
            product_stock: 50,
            product_sold_amount: 10,
            product_status: "active"
        },
        {
            product_name: "Surface Laptop 6",
            product_description: "Microsoft Surface Laptop 6 with Intel Core Ultra, 16GB RAM, 512GB SSD",
            product_slug: "surface-laptop-6",
            product_brand: "Microsoft",
            product_price: "1899",
            product_imgs: [
                "https://example.com/images/surface-front.jpg",
                "https://example.com/images/surface-back.jpg"
            ],
            product_category: "laptop",
            product_attributes: {
                cpu: "Intel Core Ultra",
                ram: "16GB",
                storage: "512GB SSD",
                screen: "13.5-inch PixelSense",
                color: "Platinum"
            },
            product_stock: 30,
            product_sold_amount: 5,
            product_status: "active"
        }]);
    });

    it("should return product list with pagination metadata", async () => {
        const result = await ProductService.AllProducts({
            page: 1,
            limit: 10
        });

        expect(result).toHaveProperty("products");
        expect(result).toHaveProperty("total");
        expect(result.products).toBeInstanceOf(Array);
    });
    it("should return product list with query", async () => {
        const result = await ProductService.AllProducts({
            page: 1,
            limit: 10,
            q: "mac"
        });

        // console.log(result);

        expect(result).toHaveProperty("products");
        expect(result).toHaveProperty("total");
        expect(result.products[0]?.product_name).toBe("MacBook Pro 2025")
    });

});

