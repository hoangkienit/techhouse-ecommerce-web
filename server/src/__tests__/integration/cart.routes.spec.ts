import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../../app";
import Product from "../../models/product.model";
import Cart from "../../models/cart.model";
import Order from "../../models/order.model";
import User from "../../models/user.model";
import Address from "../../models/address.model";
import AddressRepo from "../../repositories/address.repository";
import DiscountCode from "../../models/discount.model";

// Bypass auth + validation layers for integration focus
jest.mock("../../middlewares/verify.middleware", () => ({
  Authenticate: (req: any, res: any, next: any) => next(),
  AuthorizeAdmin: (req: any, res: any, next: any) => next()
}));

jest.mock("../../middlewares/validate.middleware", () => ({
  validate: () => (req: any, res: any, next: any) => next()
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_ACCESS_SECRET = "test_access_secret";
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Address.deleteMany({}),
    DiscountCode.deleteMany({}),
    User.deleteMany({})
  ]);
});

describe("Cart guest checkout flow", () => {
  let productOne: any;
  let productTwo: any;

  beforeEach(async () => {
    [productOne, productTwo] = await Product.insertMany([
      {
        product_name: "MacBook Pro 2025",
        product_description: "Laptop",
        product_slug: "macbook-pro-2025",
        product_brand: "Apple",
        product_price: 1999,
        product_imgs: ["http://img/mac.jpg"],
        product_category: "laptop",
        product_attributes: {},
        product_stock: 10
      },
      {
        product_name: "Surface Laptop 6",
        product_description: "Laptop",
        product_slug: "surface-laptop-6",
        product_brand: "Microsoft",
        product_price: 1499,
        product_imgs: ["http://img/surface.jpg"],
        product_category: "laptop",
        product_attributes: {},
        product_stock: 12
      }
    ]);
  });

  it("allows guest to add items, update, and checkout", async () => {
    // Guest adds first product
    const addFirst = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productOne._id.toString(), quantity: 1 });

    expect(addFirst.status).toBe(200);
    expect(addFirst.body.data.items).toHaveLength(1);
    const guestCartId = addFirst.body.data.cartId;
    expect(guestCartId).toBeTruthy();

    // Add second product under same guest cart
    const addSecond = await request(app)
      .post("/api/v1/cart/items")
      .set("x-cart-id", guestCartId)
      .send({ productId: productTwo._id.toString(), quantity: 2 });

    expect(addSecond.status).toBe(200);
    expect(addSecond.body.data.items).toHaveLength(2);
    const surfaceItem = addSecond.body.data.items.find((item: any) => item.product_name === "Surface Laptop 6");
    expect(surfaceItem.quantity).toBe(2);

    // Update quantity of the first item
    const firstItemId = addSecond.body.data.items.find((item: any) => item.product_name === "MacBook Pro 2025")._id;
    const updateRes = await request(app)
      .patch(`/api/v1/cart/items/${firstItemId}`)
      .set("x-cart-id", guestCartId)
      .send({ quantity: 3 });

    expect(updateRes.status).toBe(200);
    const updatedItem = updateRes.body.data.items.find((item: any) => item.product_name === "MacBook Pro 2025");
    expect(updatedItem.quantity).toBe(3);

    // Send shipping details
    const shippingRes = await request(app)
      .post("/api/v1/cart/checkout/shipping")
      .set("x-cart-id", guestCartId)
      .send({
        contactEmail: "guest@example.com",
        shippingAddress: {
          fullName: "Guest User",
          line1: "123 Main St",
          city: "Metropolis",
          country: "USA"
        }
      });

    expect(shippingRes.status).toBe(200);
    expect(shippingRes.body.data.checkoutStep).toBe("shipping");

    // Provide payment details
    const paymentRes = await request(app)
      .post("/api/v1/cart/checkout/payment")
      .set("x-cart-id", guestCartId)
      .send({
        paymentMethod: {
          type: "card",
          provider: "VISA",
          last4: "4242"
        }
      });

    expect(paymentRes.status).toBe(200);
    expect(paymentRes.body.data.checkoutStep).toBe("payment");

    // Confirm checkout
    const confirmRes = await request(app)
      .post("/api/v1/cart/checkout/confirm")
      .set("x-cart-id", guestCartId)
      .send();

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.orderCode).toBeDefined();
    expect(confirmRes.body.data.cart?.status).toBe("completed");

    const orders = await Order.find({});
    expect(orders).toHaveLength(1);
    const persistedOrder = orders[0];
    expect(persistedOrder?.items).toHaveLength(2);
    expect(persistedOrder?.contactEmail).toBe("guest@example.com");
  });

  it("allows authenticated user to reuse an existing address", async () => {
    const user = await User.create({
      fullname: "Jane User",
      email: "jane@example.com",
      password: "hashed",
      role: "user",
      addresses: []
    });

    const savedAddress = await AddressRepo.createForUser(user._id.toString(), {
      street: "456 Elm St",
      city: "Gotham",
      country: "USA",
      fullName: "Jane User",
      phone: "123456789",
      isDefault: true
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        role: user.role
      },
      process.env.JWT_ACCESS_SECRET as string
    );

    const authCookie = `accessToken=${token}`;

    // user adds items while authenticated
    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .set("Cookie", authCookie)
      .send({ productId: productOne._id.toString(), quantity: 1 });

    expect(addRes.status).toBe(200);
    expect(addRes.body.data.userId).toBe(user._id.toString());

    const shippingRes = await request(app)
      .post("/api/v1/cart/checkout/shipping")
      .set("Cookie", authCookie)
      .send({
        addressId: savedAddress._id.toString(),
        contactEmail: "order@example.com",
        setAsDefault: true
      });

    expect(shippingRes.status).toBe(200);
    expect(shippingRes.body.data.shippingAddress.line1).toBe("456 Elm St");
    expect(shippingRes.body.data.shippingAddress.city).toBe("Gotham");

    const storedAddress = await Address.findById(savedAddress._id);
    expect(storedAddress?.isDefault).toBe(true);
  });

  it("removes an item when quantity is set to zero", async () => {
    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productOne._id.toString(), quantity: 2 });

    expect(addRes.status).toBe(200);
    const guestCartId = addRes.body.data.cartId;
    const itemId = addRes.body.data.items[0]._id;

    const updateRes = await request(app)
      .patch(`/api/v1/cart/items/${itemId}`)
      .set("x-cart-id", guestCartId)
      .send({ quantity: 0 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.items).toHaveLength(0);
  });

  it("rejects providing addressId for guest checkout", async () => {
    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productOne._id.toString(), quantity: 1 });

    const guestCartId = addRes.body.data.cartId;

    const shippingRes = await request(app)
      .post("/api/v1/cart/checkout/shipping")
      .set("x-cart-id", guestCartId)
      .send({
        addressId: new mongoose.Types.ObjectId().toString(),
        contactEmail: "guest@example.com"
      });

    expect(shippingRes.status).toBe(400);
    expect(shippingRes.body.message).toMatch(/đăng nhập/i);
  });

  it("allows authenticated user to save a new address during checkout", async () => {
    const user = await User.create({
      fullname: "John Checkout",
      email: "john.checkout@example.com",
      password: "hashed",
      role: "user",
      addresses: []
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        fullname: user.fullname,
        email: user.email,
        role: user.role
      },
      process.env.JWT_ACCESS_SECRET as string
    );

    const authCookie = `accessToken=${token}`;

    await request(app)
      .post("/api/v1/cart/items")
      .set("Cookie", authCookie)
      .send({ productId: productTwo._id.toString(), quantity: 1 });

    const shippingRes = await request(app)
      .post("/api/v1/cart/checkout/shipping")
      .set("Cookie", authCookie)
      .send({
        contactEmail: "john.checkout@example.com",
        saveAsNew: true,
        setAsDefault: true,
        shippingAddress: {
          fullName: "John Checkout",
          line1: "789 Sunset Blvd",
          city: "Star City",
          state: "CA",
          postalCode: "90001",
          country: "USA",
          phone: "987654321"
        }
      });

    expect(shippingRes.status).toBe(200);
    expect(shippingRes.body.data.shippingAddress.line1).toBe("789 Sunset Blvd");
    expect(shippingRes.body.data.contactEmail).toBe("john.checkout@example.com");

    const savedAddresses = await Address.find({ userId: user._id });
    expect(savedAddresses).toHaveLength(1);
    const savedAddress = savedAddresses[0]!;
    expect(savedAddress.isDefault).toBe(true);
    expect(savedAddress.street).toBe("789 Sunset Blvd");
  });

  it("applies a valid discount code and recalculates totals", async () => {
    await DiscountCode.create({
      code: "SAVE5",
      percentage: 10,
      usageLimit: 5
    });

    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productOne._id.toString(), quantity: 1 });

    const guestCartId = addRes.body.data.cartId;

    const discountRes = await request(app)
      .post("/api/v1/cart/discount/apply")
      .set("x-cart-id", guestCartId)
      .send({ code: "SAVE5" });

    expect(discountRes.status).toBe(200);
    expect(discountRes.body.data.discountCode).toBe("SAVE5");
    expect(discountRes.body.data.discountRate).toBe(10);
    expect(discountRes.body.data.discountAmount).toBeGreaterThan(0);
    expect(discountRes.body.data.total).toBeLessThan(discountRes.body.data.subtotal + discountRes.body.data.tax + discountRes.body.data.shipping);
  });

  it("rejects discount code that has no remaining uses", async () => {
    await DiscountCode.create({
      code: "LIMIT",
      percentage: 5,
      usageLimit: 1,
      usageCount: 1
    });

    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productTwo._id.toString(), quantity: 1 });

    const guestCartId = addRes.body.data.cartId;

    const discountRes = await request(app)
      .post("/api/v1/cart/discount/apply")
      .set("x-cart-id", guestCartId)
      .send({ code: "LIMIT" });

    expect(discountRes.status).toBe(400);
    expect(discountRes.body.message).toMatch(/hết lượt/i);
  });

  it("removes discount code and restores totals", async () => {
    await DiscountCode.create({
      code: "DELTA",
      percentage: 15,
      usageLimit: 3
    });

    const addRes = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productOne._id.toString(), quantity: 1 });

    const guestCartId = addRes.body.data.cartId;

    await request(app)
      .post("/api/v1/cart/discount/apply")
      .set("x-cart-id", guestCartId)
      .send({ code: "DELTA" });

    const removeRes = await request(app)
      .delete("/api/v1/cart/discount/remove")
      .set("x-cart-id", guestCartId)
      .send();

    expect(removeRes.status).toBe(200);
    expect(removeRes.body.data.discountCode).toBe(null);
    expect(removeRes.body.data.discountAmount).toBe(0);
  });
});
