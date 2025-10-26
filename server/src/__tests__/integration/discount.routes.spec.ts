import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../app";
import DiscountCode from "../../models/discount.model";

jest.mock("../../middlewares/verify.middleware", () => ({
  Authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: "68f9d3f0884b2f76322eee88", role: "admin" };
    next();
  },
  AuthorizeAdmin: (req: any, res: any, next: any) => next()
}));

jest.mock("../../middlewares/validate.middleware", () => ({
  validate: (schema: any) => (req: any, res: any, next: any) => {
    const { error } = schema().validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    next();
  }
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await DiscountCode.deleteMany({});
});

describe("Discount code administration", () => {
  it("creates a discount code successfully", async () => {
    const res = await request(app)
      .post("/api/v1/discount")
      .send({
        code: "SAVE5",
        description: "Save 5 percent",
        percentage: 5,
        usageLimit: 3
      });

    expect(res.status).toBe(201);
    expect(res.body.data.discount.code).toBe("SAVE5");
    expect(res.body.data.discount.percentage).toBe(5);

    const stored = await DiscountCode.findOne({ code: "SAVE5" }).lean();
    expect(stored).toBeTruthy();
    expect(stored?.usageLimit).toBe(3);
  });

  it("rejects duplicate discount codes", async () => {
    await DiscountCode.create({
      code: "DEAL1",
      percentage: 10,
      usageLimit: 2
    });

    const res = await request(app)
      .post("/api/v1/discount")
      .send({
        code: "DEAL1",
        percentage: 10,
        usageLimit: 2
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/đã tồn tại/i);
  });

  it("validates usage limit constraints", async () => {
    const res = await request(app)
      .post("/api/v1/discount")
      .send({
        code: "LIMIT",
        percentage: 20,
        usageLimit: 15
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Số lượt sử dụng tối đa là 10/i);
  });

  it("lists existing discount codes", async () => {
    await DiscountCode.insertMany([
      { code: "SALE1", percentage: 10, usageLimit: 5 },
      { code: "SALE2", percentage: 15, usageLimit: 4 }
    ]);

    const res = await request(app)
      .get("/api/v1/discount")
      .send();

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.discounts)).toBe(true);
    expect(res.body.data.discounts.length).toBeGreaterThanOrEqual(2);
  });
});
