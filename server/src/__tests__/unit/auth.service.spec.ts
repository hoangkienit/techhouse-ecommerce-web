// tests/unit/auth.service.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthService from "../../services/auth.service";
import User from "../../models/user.model";
import {
  BadRequestError,
} from "../../core/error.response";

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
  await User.deleteMany({});
});

describe("AuthService - Register", () => {
  it("should register a new user", async () => {
    const result = await AuthService.Register({
      fullname: "Test User",
      email: "test@example.com",
      address: {
        street: "123 Test",
        city: "Hanoi",
        state: "Test",
        country: "Vietnam",
        isDefault: true,
      },
    });

    expect(result).toBe(true);
  });

  it("should throw error if email exists", async () => {
    await User.create({
      fullname: "Existing",
      email: "test@example.com",
      password: "hash",
    });

    await expect(
      AuthService.Register({
        fullname: "New User",
        email: "test@example.com",
        address: {
          street: "123",
          city: "Hanoi",
          state: "Test",
          country: "Vietnam",
          isDefault: true,
        },
      })
    ).rejects.toThrow(BadRequestError);
  });
});

describe("AuthService - Login", () => {
  beforeEach(async () => {
    const hashed = await bcrypt.hash("123456", 10);
    await User.create({
      fullname: "Login User",
      email: "login@example.com",
      password: hashed,
    });
  });

  it("should login successfully", async () => {
    const res = await AuthService.Login({
      email: "login@example.com",
      password: "123456",
    });

    expect(res).toHaveProperty("accessToken");
    expect(jwt.verify(res.accessToken, process.env.JWT_ACCESS_SECRET!)).toBeTruthy();
  });
});
