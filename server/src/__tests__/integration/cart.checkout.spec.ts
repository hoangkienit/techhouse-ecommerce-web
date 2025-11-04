import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import CartService from "../../services/cart.service";
import Product from "../../models/product.model";
import User from "../../models/user.model";
import Cart from "../../models/cart.model";
import Order from "../../models/order.model";
import Loyalty from "../../models/loyalty.model";

jest.mock("../../config/socket", () => ({
  getIO: () => ({
    to: () => ({
      emit: jest.fn()
    })
  })
}));

jest.setTimeout(30000);

describe("CartService.confirmCheckout", () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: { ip: "127.0.0.1" }
    });
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 1) {
      return;
    }
    await Promise.all([
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Loyalty.deleteMany({})
    ]);
  });

  const createProduct = async (price: number) => {
    return Product.create({
      product_name: "Gaming Laptop",
      product_description: "High-end gaming laptop",
      product_slug: "gaming-laptop",
      product_brand: "Techhouse",
      product_price: price,
      product_imgs: ["https://example.com/image.jpg"],
      product_category: "laptop",
      product_attributes: {
        cpu: "Intel i9",
        ram: "32GB",
        storage: "1TB SSD"
      },
      product_stock: 10
    });
  };

  const withCartReadyForCheckout = async (userId: string, productPrice: number, quantity: number) => {
    const product = await createProduct(productPrice);

    await CartService.AddItem({ userId }, product._id.toString(), quantity);

    await CartService.setShippingDetails(
      { userId },
      {
        shippingAddress: {
          fullName: "John Doe",
          line1: "123 Main St",
          city: "Tech City",
          country: "VN",
          phone: "0123456789"
        },
        contactEmail: "john@example.com",
        shippingName: "John Doe"
      }
    );

    await CartService.setPaymentMethod(
      { userId },
      {
        type: "cod",
        note: "Pay on delivery"
      }
    );
  };

  it("awards loyalty points for authenticated user without redemption", async () => {
    const user = await User.create({
      fullname: "No Points User",
      email: "nopoints@example.com",
      password: "secret",
      loyalty_points: 0
    });

    const userId = user._id.toString();

    await withCartReadyForCheckout(userId, 100, 2);

    const result = await CartService.confirmCheckout({ userId }, 0);

    expect(result.order.total).toBeCloseTo(240);
    expect(result.order.points_used).toBe(0);
    expect(result.order.points_earned).toBe(24);

    const updatedUser = await User.findById(userId).lean();
    expect(updatedUser?.loyalty_points).toBe(24);
  });

  it("redeems loyalty points and updates totals correctly", async () => {
    const user = await User.create({
      fullname: "Loyal User",
      email: "loyal@example.com",
      password: "secret",
      loyalty_points: 10
    });

    const userId = user._id.toString();

    await withCartReadyForCheckout(userId, 2000, 1);

    const result = await CartService.confirmCheckout({ userId }, 1);

    expect(result.order.total).toBeCloseTo(1200);
    expect(result.order.points_used).toBe(1);
    expect(result.order.points_earned).toBe(120);

    const updatedUser = await User.findById(userId).lean();
    expect(updatedUser?.loyalty_points).toBe(129);
  });
});
