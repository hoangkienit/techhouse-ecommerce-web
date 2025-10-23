import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Product from "../../models/product.model";
import Comment from "../../models/comment.model";

jest.mock("../../middlewares/verify.middleware", () => ({
    Authenticate: (req: any, res: any, next: any) => next(),
    AuthorizeAdmin: (req: any, res: any, next: any) => next()
}));

jest.mock("../../middlewares/validate.middleware", () => ({
    validate: (schema: any) => (req: any, res: any, next: any) => next()
}));

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
    await Comment.deleteMany({});
});


describe("GET /api/v1/review/:productId/comments (ListComment API)", () => {
    let productId: string;
    beforeEach(async () => {
        // Create a product
        const product = await Product.create({
            product_name: "Test Product",
            product_description: "A product for comment testing",
            product_slug: "test-product",
            product_brand: "Apple",
            product_price: "999",
            product_imgs: ["https://example.com/img1.jpg"],
            product_category: "laptop",
            product_attributes: { ram: "16GB" },
            product_stock: 10,
            product_sold_amount: 0,
            product_status: "active"
        });
        productId = product._id.toString();

        // Insert comments for this product
        await Comment.insertMany([
            { productId, ipHash: "faefsfsfes", userId: "507f1f77bcf86cd799439011", content: "Great product!", createdAt: new Date("2023-01-01") },
            { productId, ipHash: "faefsfsfes", userId: "507f1f77bcf86cd799439012", content: "Not bad", createdAt: new Date("2023-01-02") },
            { productId, ipHash: "faefsfsfes", userId: "507f1f77bcf86cd799439013", content: "Could be better", createdAt: new Date("2023-01-03") }
        ]);
    });

    it("should return all comments for a product", async () => {
        const response = await request(app)
            .get(`/api/v1/review/${productId}/comments`)
            .query({ page: 1, limit: 10 });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.comments)).toBe(true);
        expect(response.body.data.comments.length).toBe(3);
        expect(response.body.data.total).toBe(3);
        expect(response.body.data.comments[0]).toHaveProperty("content");
    });

    it("should paginate comments", async () => {
        const response = await request(app)
            .get(`/api/v1/review/${productId}/comments`)
            .query({ page: 2, limit: 2 });
        expect(response.status).toBe(200);
        expect(response.body.data.comments.length).toBe(1);
        expect(response.body.data.page).toBe(2);
        expect(response.body.data.total).toBe(3);
    });

    it("should return empty array if no comments exist", async () => {
        // Create a new product with no comments
        const newProduct = await Product.create({
            product_name: "No Comment Product",
            product_description: "No comments yet",
            product_slug: "no-comment-product",
            product_brand: "Apple",
            product_price: "1000",
            product_imgs: ["https://example.com/img2.jpg"],
            product_category: "laptop",
            product_attributes: { ram: "8GB" },
            product_stock: 5,
            product_sold_amount: 0,
            product_status: "active"
        });
        const response = await request(app)
            .get(`/api/v1/review/${newProduct._id}/comments`)
            .query({ page: 1, limit: 10 });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.comments)).toBe(true);
        expect(response.body.data.comments.length).toBe(0);
        expect(response.body.data.total).toBe(0);
    });

    it("should return 404 if product does not exist", async () => {
        const nonExistentId = "507f1f77bcf86cd799439099";
        const response = await request(app)
            .get(`/api/v1/review/${nonExistentId}/comments`)
            .query({ page: 1, limit: 10 });
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/Sản phẩm không tồn tại/);
    });
});
