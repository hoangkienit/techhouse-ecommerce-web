
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../app";
import User from "../../models/user.model";

let mongoServer: MongoMemoryServer;

jest.mock("../../middlewares/validate.middleware", () => ({
  validate: (schema: any) => (req: any, res: any, next: any) => next()
}));


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
  await User.deleteMany({});
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(async () => {
    const hashed = await bcrypt.hash("123456", 10);
    await User.create({
      fullname: "Test Login",
      email: "login@example.com",
      password: hashed,
    });
  });

  it("should set cookies on login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "login@example.com", password: "123456" })
      .expect(200);

    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
