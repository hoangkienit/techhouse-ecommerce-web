import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import Product from "../../models/product.model";
import Rating from "../../models/rating.model";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../../middlewares/verify.middleware", () => ({
    Authenticate: (req: any, res: any, next: any) => {
        req.user = {
            userId: "68f9d3f0884b2f76322eee88",
            fullname: "Nguyen Hoang Kien",
            email: "kien@gmail.com",
            role: "user"
        }

        next();
    },
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
    await Rating.deleteMany({});
});

describe("POST /api/v1/review/:productId/rating (RateProduct API)", () => {
    let productId: string;
    let userId = new mongoose.Types.ObjectId();
    beforeEach(async () => {
        const product = await Product.create({
            product_name: "Test Product",
            product_description: "A product for rating testing",
            product_slug: "test-product",
            product_brand: "Apple",
            product_price: 999,
            product_imgs: ["https://example.com/img1.jpg"],
            product_category: "laptop",
            product_attributes: { ram: "16GB" },
            product_stock: 10,
            product_sold_amount: 0,
            product_status: "active"
        });
        productId = product._id.toString();
    });

    it("should rate a product successfully", async () => {
        const response = await request(app)
            .post(`/api/v1/review/${productId}/rating`)
            .send({ stars: 5 })
            .expect(200);
        expect(response.body.data.rating).toHaveProperty("stars", 5);
        expect(response.body.data.rating).toHaveProperty("productId", productId);
    });

    it("should not allow rating with invalid stars", async () => {
        const response = await request(app)
            .post(`/api/v1/review/${productId}/rating`)
            .send({ stars: 10 });
        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should return 404 if product does not exist", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post(`/api/v1/review/${nonExistentId}/rating`)
            .send({ stars: 4 });
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/Sản phẩm không tồn tại/);
    });
});
