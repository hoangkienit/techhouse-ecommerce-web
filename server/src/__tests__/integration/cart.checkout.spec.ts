import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import Product from "../../models/product.model";
import User from "../../models/user.model";
import Cart from "../../models/cart.model";
import Order from "../../models/order.model";
import Loyalty from "../../models/loyalty.model";
import app from './../../app';
import request from "supertest";
import Address from "../../models/address.model";

jest.mock("../../config/socket", () => ({
  getIO: () => ({
    to: () => ({
      emit: jest.fn()
    })
  })
}));

jest.mock("../../middlewares/verify.middleware", () => ({
  Authenticate: (req: any, res: any, next: any) => next(),
  AuthorizeAdmin: (req: any, res: any, next: any) => next(),
}));

jest.mock("../../middlewares/optional-auth.middleware", () => ({
  OptionalAuthenticate: (req: any, res: any, next: any) => {
    req.user = { ...(req.user ?? {}), userId: "69049c7e373fefa7aa7f5ae6" };
    return next();
  }
}));

jest.mock("../../middlewares/validate.middleware", () => ({
  validate: () => (req: any, res: any, next: any) => next()
}));

jest.setTimeout(30000);

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({replSet: { count: 1 }});
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
    User.deleteMany({}),
    Loyalty.deleteMany({}),
    Address.deleteMany({})
  ]);
});

describe('Authenticated user checkout flow', () => {
  let productOne: any;
  let productTwo: any;
  let user: any;
  let address: any;

  beforeEach(async () => {
    [productOne, productTwo] = await Product.insertMany([
      {
        product_name: "MacBook Pro 2025",
        product_description: "Laptop",
        product_slug: "macbook-pro-2025",
        product_brand: "Apple",
        product_price: 70000,
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
        product_price: 20000,
        product_imgs: ["http://img/surface.jpg"],
        product_category: "laptop",
        product_attributes: {},
        product_stock: 12
      }
    ]);

    user = await User.create({
      _id: new mongoose.Types.ObjectId("69049c7e373fefa7aa7f5ae6"),
      fullname: "Nguyen Hoang Kien",
      email: "kiennguyen4321abc@gmail.com",
      password: "secret",
      loyalty_points: 400,
      addresses: [new mongoose.Types.ObjectId("69049c7e373fefa7aa7f5ae9")]
    });

    address = await Address.create({
      _id: new mongoose.Types.ObjectId("69049c7e373fefa7aa7f5ae9"),
      userId: new mongoose.Types.ObjectId("69049c7e373fefa7aa7f5ae6"),
      street: "Ben Van Don",
      city: "TPHCM",
      country: "Vietnam"
    });
  });

  it('allow authenticated user add, update and checkout', async () => {
    // adds first product
    const addFirst = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productOne._id.toString(), quantity: 1 });

    expect(addFirst.status).toBe(200);
    expect(addFirst.body.data.items).toHaveLength(1);
    const userId = addFirst.body.data.userId;
    expect(userId).toBeTruthy();

    // Add second product under same guest cart
    const addSecond = await request(app)
      .post("/api/v1/cart/items")
      .send({ productId: productTwo._id.toString(), quantity: 2 });

    expect(addSecond.status).toBe(200);
    expect(addSecond.body.data.items.length).toBe(2);
    const surfaceItem = addSecond.body.data.items.find((item: any) => item.product_name === "Surface Laptop 6");
    expect(surfaceItem.quantity).toBe(2);

    // Update quantity of the first item
    const firstItemId = addSecond.body.data.items.find((item: any) => item.product_name === "MacBook Pro 2025")._id;
    const updateRes = await request(app)
      .patch(`/api/v1/cart/items/${firstItemId}`)
      .send({ quantity: 2 });

    expect(updateRes.status).toBe(200);
    const updatedItem = updateRes.body.data.items.find((item: any) => item.product_name === "MacBook Pro 2025");
    expect(updatedItem.quantity).toBe(2);


    const subtotal = updateRes.body.data.subtotal;
    expect(subtotal).toBe(180000);

    // Send shipping details with new address 
    const shippingRes = await request(app)
      .post("/api/v1/cart/checkout/shipping")
      .send({
        shippingAddress: {
          line1: "19 Nguyen Huu Tho",
          city: "TPHCM",
          country: "Vietnam"
        },
        saveAsNew: true
      });

    expect(shippingRes.status).toBe(200);
    expect(Array.isArray(shippingRes.body.data.checkoutTimeline)).toBe(true);
    const shippingTimeline = shippingRes.body.data.checkoutTimeline;
    expect(shippingTimeline[shippingTimeline.length - 1].step).toBe("shipping");

    // Provide payment details
    const paymentRes = await request(app)
      .post("/api/v1/cart/checkout/payment")
      .send({
        paymentMethod: {
          type: "bank_transfer"
        }
      });

    expect(paymentRes.status).toBe(200);
    const paymentTimeline = paymentRes.body.data.checkoutTimeline;
    expect(paymentTimeline[paymentTimeline.length - 1].step).toBe("payment");

    const paymentType = paymentRes.body.data.paymentMethod.type;
    expect(paymentType).toBe("bank_transfer");

    // Confirm checkout
    const confirmRes = await request(app)
      .post("/api/v1/cart/checkout/confirm")
      .send({
        points: 190
      });
      console.log(confirmRes.body.data);
    expect(confirmRes.status).toBe(200);
    
    const cartTotal = confirmRes.body.data.cart.total;
    expect(cartTotal).toBe(8000);

    const orders = await Order.find({});
    expect(orders).toHaveLength(1);
    const persistedOrder = orders[0];
    expect(persistedOrder?.items).toHaveLength(2);
    expect(persistedOrder?.total).toBe(8000);
    expect(persistedOrder?.points_earned).toBe(8);
    expect(persistedOrder?.points_used).toBe(190);

  });
});

