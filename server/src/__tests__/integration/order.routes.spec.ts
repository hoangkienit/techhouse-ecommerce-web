import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import Order from "../../models/order.model";
import Loyalty from "../../models/loyalty.model";

jest.mock("../../middlewares/verify.middleware", () => ({
  Authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: new mongoose.Types.ObjectId().toString(), role: "admin" };
    return next();
  },
  AuthorizeAdmin: (_req: any, _res: any, next: any) => next()
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
  await Promise.all([Order.deleteMany({}), Loyalty.deleteMany({})]);
});

describe("DELETE /api/v1/order/:orderId", () => {
  it("deletes the order and associated loyalty records", async () => {
    const order = await Order.create({
      orderCode: `ORD-${Date.now()}`,
      user: new Types.ObjectId(),
      items: [
        {
          product: new Types.ObjectId(),
          product_name: "Keyboard MK1",
          product_brand: "Techhouse",
          unitPrice: 150,
          quantity: 2,
          lineTotal: 300
        }
      ],
      subtotal: 300,
      tax: 30,
      shipping: 20,
      total: 350,
      currency: "VND",
      status: "pending",
      placedAt: new Date()
    });

    await Loyalty.create({
      user: new Types.ObjectId(),
      type: "earn",
      points: 150,
      order: order._id
    });

    const response = await request(app).delete(`/api/v1/order/${order._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Xoá đơn hàng thành công");
    expect(await Order.findById(order._id)).toBeNull();
    expect(await Loyalty.find({ order: order._id })).toHaveLength(0);
  });

  it("returns 400 when the order does not exist", async () => {
    const response = await request(app).delete(`/api/v1/order/${new Types.ObjectId()}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Order not found");
  });
});

describe("PATCH /api/v1/order/:orderId/status", () => {
  it("updates the order status when admin requests", async () => {
    const order = await Order.create({
      orderCode: `ORD-${Date.now()}`,
      user: new Types.ObjectId(),
      items: [
        {
          product: new Types.ObjectId(),
          product_name: "Mouse MX Master",
          product_brand: "Techhouse",
          unitPrice: 99,
          quantity: 1,
          lineTotal: 99
        }
      ],
      subtotal: 99,
      tax: 10,
      shipping: 5,
      total: 114,
      currency: "VND",
      status: "pending",
      placedAt: new Date()
    });

    const response = await request(app)
      .patch(`/api/v1/order/${order._id}/status`)
      .send({ status: "confirmed" });

    expect(response.status).toBe(200);
    expect(response.body.data.order.status).toBe("confirmed");

    const updated = await Order.findById(order._id);
    expect(updated?.status).toBe("confirmed");
  });

  it("returns 400 when order cannot be found", async () => {
    const response = await request(app)
      .patch(`/api/v1/order/${new Types.ObjectId()}/status`)
      .send({ status: "confirmed" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Order not found");
  });
});
