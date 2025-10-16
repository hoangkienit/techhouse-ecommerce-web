import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../models/user.model";


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
    await User.deleteMany({});
});


describe("PATCH /api/v1/user/set-status/:userId (Set User Ban Status)", () => {
    let userId: string;

    beforeEach(async () => {
        const user = await User.create({
            fullname: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0987654321",
            password: "123456",
            profileImg: "https://iampesmobile.com/uploads/user-avatar-taskify.jpg",
            role: "user",
            socialProvider: null,
            socialId: null,
            addresses: [],
            isBanned: false
        });

        userId = user._id.toString();
    });

    it("should update isBanned to true and return updatedUser", async () => {
        const response = await request(app)
            .patch(`/api/v1/user/set-status/${userId}`)
            .send({
                status: true
            });

        expect(response.status).toBe(200);
        expect(response.body.data.updatedUser.isBanned).toBe(true);
    });
});
