import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthService from "../../services/auth.service";
import User from "../../models/user.model";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../../core/error.response";
import request from "supertest";
import server from "../../server";


let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Mock secret keys
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

describe("AuthService", () => {
  describe("Register", () => {
    it("should register a new user successfully", async () => {
      const result = await AuthService.Register({
        fullname: "Nguyen Kien",
        email: "kien@example.com",
        password: "123456",
        confirmPassword: "123456",
        address: {
          street: "123 Test",
          city: "Hanoi",
          state: "Cau Giay",
          country: "Vietnam",
          isDefault: true
        },
      });

      expect(result).toBe(true);

      const userInDb = await User.findOne({ email: "kien@example.com" });
      expect(userInDb).not.toBeNull();
      expect(await bcrypt.compare("123456", userInDb!.password)).toBe(true);
    });

    it("should throw error if email already exists", async () => {
      await User.create({
        fullname: "Existing User",
        email: "kien@example.com",
        password: "hashed",
      });

      await expect(
        AuthService.Register({
          fullname: "New User",
          email: "kien@example.com",
          password: "123456",
          confirmPassword: "123456",
          address: {
            street: "123 Test",
            city: "Hanoi",
            state: "Cau Giay",
            country: "Vietnam",
            isDefault: true
          },
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw error if confirmPassword does not match", async () => {
      await expect(
        AuthService.Register({
          fullname: "Mismatch User",
          email: "kien2@example.com",
          password: "123456",
          confirmPassword: "wrong",
          address: {
            street: "123 Test",
            city: "Hanoi",
            state: "Cau Giay",
            country: "Vietnam",
            isDefault: true
          },
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("Login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        fullname: "Login User",
        email: "login@example.com",
        password: hashedPassword,
      });
    });

    it("should login successfully and return tokens", async () => {
      const res = await AuthService.Login({
        email: "login@example.com",
        password: "123456",
      });

      expect(res).toHaveProperty("accessToken");
      expect(res).toHaveProperty("refreshToken");
      expect(res.user).toHaveProperty("email", "login@example.com");

      const decoded = jwt.verify(res.accessToken, process.env.JWT_ACCESS_SECRET!);
      expect((decoded as any).email).toBe("login@example.com");
    });

    it("should set token to cookie", async () => {
      const res = await request(server)
        .post("/api/v1/auth/login")
        .send({ email: "login@example.com", password: "123456" })
        .expect(200);

      const rawCookies = res.headers["set-cookie"];
      expect(rawCookies).toBeDefined();

      const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];

      const accessCookie = cookies.find((c: string) => c.startsWith("accessToken="));
      const refreshCookie = cookies.find((c: string) => c.startsWith("refreshToken="));

      expect(accessCookie).toBeDefined();
      expect(refreshCookie).toBeDefined();
    });

    it("should throw error if email not found", async () => {
      await expect(
        AuthService.Login({ email: "notfound@example.com", password: "123456" })
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw error if password is wrong", async () => {
      await expect(
        AuthService.Login({ email: "login@example.com", password: "wrongpass" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("RefreshToken", () => {
    it("should return new access token with valid refresh token", async () => {
      const refreshToken = jwt.sign(
        { userId: "123", email: "test@example.com", role: "user" },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "1h" }
      );

      const newAccessToken = await AuthService.RefreshToken(refreshToken);
      const decoded = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET!);

      expect((decoded as any).userId).toBe("123");
    });

    it("should throw error with invalid refresh token", async () => {
      await expect(AuthService.RefreshToken("invalid.token")).rejects.toThrow(
        UnauthorizedError
      );
    });
  });
});
