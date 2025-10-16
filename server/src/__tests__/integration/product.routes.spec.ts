import request from "supertest";
import app from "../../app";
import path from "path";
import fs from "fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Product from "../../models/product.model";

jest.mock("../../utils/upload.helper", () => ({
  uploadMultipleToCloudinary: jest.fn().mockResolvedValue([
    "https://mock.cloudinary.com/image1.jpg",
    "https://mock.cloudinary.com/image2.jpg"
  ])
}));

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
});


describe("POST /api/v1/product/add (Image Upload)", () => {
  it("should upload image(s) and create product successfully", async () => {
    const img1 = path.resolve(__dirname, "../mock-images/sample_1.jpeg");
    const img2 = path.resolve(__dirname, "../mock-images/sample_2.jpg");

    console.log("File exists:", fs.existsSync(img1), fs.existsSync(img2));

    const response = await request(app)
      .post("/api/v1/product/add")
      .set("Content-Type", "multipart/form-data")
      .field("product_name", "Test Product")
      .field("product_description", "Test description")
      .field("product_price", "999")
      .field("product_category", "laptop")
      .field("product_attributes", "{}")
      .attach("images", img1)
      .attach("images", img2);

    expect(response.status).toBe(201);
    expect(response.body.data.newProduct.product_imgs.length).toBe(2);
    expect(response.body.data.newProduct.product_name).toBe("Test Product");
  });

  it("should return error if no image is provided", async () => {
    const response = await request(app)
      .post("/api/v1/product/add")
      .field("product_name", "Test Product")
      .field("product_description", "Test description")
      .field("product_price", "999")
      .field("product_category", "laptop")
      .field("product_stock", 2);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Cần ít nhất 1 ảnh cho sản phẩm/);
  });
});

describe("PATCH /api/v1/product/update/:productId (Update Product)", () => {
  let productId: string;

  beforeEach(async () => {
    const product = await Product.create({
      product_name: "MacBook Pro 2025",
      product_description: "Apple MacBook Pro with M5 Chip, 32GB RAM, 1TB SSD",
      product_slug: "macbook-pro-2025",
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
    });

    productId = product._id.toString();
  });

  it("should update product and return updatedProduct successfully", async () => {
    const response = await request(app)
      .patch(`/api/v1/product/update/${productId}`)
      .send({
        product_name: "Updated MacBook Pro 2026",
        product_price: "3499"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.updatedProduct.product_name).toBe("Updated MacBook Pro 2026");
    expect(response.body.data.updatedProduct.product_price).toBe("3499");
  });
});
