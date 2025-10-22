import request from "supertest";
import app from "../../app";
import path from "path";
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

    const response = await request(app)
      .post("/api/v1/product/add")
      .field("product_name", "Test Product")
      .field("product_brand", "Apple")
      .field("product_description", "Test description")
      .field("product_price", 999)
      .field("product_category", "laptop")
      .field("product_attributes", JSON.stringify({}))
      .field("product_stock", "10")
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
      .field("product_price", 999)
      .field("product_brand", "Acer")
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
      product_brand: "Apple",
      product_price: 2999,
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
        product_price: 3499,
        product_brand: "Vivo"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.updatedProduct.product_name).toBe("Updated MacBook Pro 2026");
    expect(response.body.data.updatedProduct.product_price).toBe(3499);
    expect(response.body.data.updatedProduct.product_brand).toBe("Vivo");
  });
});

describe("GET /api/v1/product/list (Get All Products)", () => {
  beforeEach(async () => {
    await Product.insertMany([
      {
        product_name: "MacBook Pro 2025",
        product_description: "Apple MacBook Pro with M5 Chip, 32GB RAM, 1TB SSD",
        product_slug: "macbook-pro-2025",
        product_brand: "Apple",
        product_price: 2999,
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
        product_price: 1899,
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
      },
      {
        product_name: "iPhone 15 Pro",
        product_description: "Apple iPhone 15 Pro, 256GB, Titanium",
        product_slug: "iphone-15-pro",
        product_brand: "Apple",
        product_price: 1299,
        product_imgs: [
          "https://example.com/images/iphone-front.jpg",
          "https://example.com/images/iphone-back.jpg"
        ],
        product_category: "phone",
        product_attributes: {
          cpu: "Apple A17",
          ram: "8GB",
          storage: "256GB",
          screen: "6.1-inch OLED",
          color: "Titanium"
        },
        product_stock: 100,
        product_sold_amount: 50,
        product_status: "active"
      }
    ]);
  });

  it("should return product list with pagination metadata", async () => {
    const existingProducts = await Product.countDocuments({});
    expect(existingProducts).toBe(3);

    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ q: "mac", page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.products)).toBe(true);
    expect(response.body.data.products.length).toBe(1);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.page).toBe(1);
    expect(response.body.data.products[0].product_name).toMatch(/MacBook Pro 2025/);
  });

  it("should filter by brand", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ brand: "Apple" });
    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(2);
    expect(response.body.data.products.every((p: any) => p.product_brand === "Apple")).toBe(true);
  });

  it("should filter by category", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ category: "phone" });
    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(1);
    expect(response.body.data.products[0].product_category).toBe("phone");
  });

  it("should filter by minPrice and maxPrice", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ minPrice: 1200, maxPrice: 2000 });
    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(2);
    expect(response.body.data.products.every((p: any) => p.product_price >= 1200 && p.product_price <= 2000)).toBe(true);
  });

  it("should sort by price ascending", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ sort: "price_asc" });
    expect(response.status).toBe(200);
    const prices = response.body.data.products.map((p: any) => Number(p.product_price));
    expect(prices).toEqual(prices.slice().sort((a: number, b: number) => a - b));
  });

  it("should sort by price descending", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ sort: "price_desc" });
    expect(response.status).toBe(200);
    const prices = response.body.data.products.map((p: any) => Number(p.product_price));
    expect(prices).toEqual(prices.slice().sort((a: number, b: number) => b - a));
  });

  it("should paginate results", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ page: 2, limit: 2 });
    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(1);
    expect(response.body.data.page).toBe(2);
    expect(response.body.data.total).toBe(3);
  });

  it("should return empty array if no products match query", async () => {
    const response = await request(app)
      .get("/api/v1/product/list")
      .query({ q: "nonexistent" });
    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBe(0);
    expect(response.body.data.total).toBe(0);
  });
});
