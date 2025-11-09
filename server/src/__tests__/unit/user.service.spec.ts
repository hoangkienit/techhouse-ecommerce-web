import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../models/user.model";
import UserService from "../../services/user.service";

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
  await User.deleteMany({});
});

describe("UserService.GetUserLoyaltyPoints", () => {
  it("returns loyalty points for an existing user", async () => {
    const user = await User.create({
      fullname: "Test User",
      email: "test@example.com",
      password: "secret",
      loyalty_points: 120
    });

    const result = await UserService.GetUserLoyaltyPoints(user._id.toString());

    expect(result).not.toBeNull();
    expect(result?.loyalty_points).toBe(120);
  });

  it("returns null when the user does not exist", async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString();

    const result = await UserService.GetUserLoyaltyPoints(nonExistingId);

    expect(result).toBeNull();
  });
});
