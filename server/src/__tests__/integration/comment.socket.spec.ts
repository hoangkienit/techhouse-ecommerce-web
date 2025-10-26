import request from "supertest";
import { createServer } from "http";
import ioClient from "socket.io-client";
import app from "../../app";
import { initializeSocket } from "../../config/socket";
import mongoose from "mongoose";
import Product from "../../models/product.model";
import Comment from "../../models/comment.model";
import { MongoMemoryServer } from "mongodb-memory-server";

let httpServer: any, io: any, clientSocket: any, productId: string;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    httpServer = createServer(app);
    io = initializeSocket(httpServer);
    await new Promise((resolve) => httpServer.listen(0, resolve));
    const port = (httpServer.address() as any).port;
    clientSocket = ioClient(`http://localhost:${port}`, {
        path: "/ws/socket.io",
        transports: ["websocket"],
    });
    await new Promise((resolve) => clientSocket.on("connect", resolve));
    mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        process.env.JWT_ACCESS_SECRET = "test_access_secret";
        process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
});

afterAll(async () => {
    // Wait a tick to ensure afterEach is done
    await new Promise((resolve) => setTimeout(resolve, 100));
    clientSocket.close();
    io.close();
    httpServer.close();
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Product.deleteMany({});
    await Comment.deleteMany({});
});

jest.setTimeout(50000);

describe("POST /api/v1/review/:productId/comment (AddComment API)", () => {
    beforeEach(async () => {
        const product = await Product.create({
            product_name: "Test Product",
            product_description: "A product for comment testing",
            product_slug: "test-product",
            product_brand: "Apple",
            product_price: 999,
            product_imgs: ["https://example.com/img1.jpg"],
            product_category: "laptop",
            product_attributes: { ram: "16GB" },
            product_stock: 10,
            product_sold_amount: 0,
            product_status: "active"
        });
        productId = product._id.toString();
    });

    it("should add a comment and emit socket event", (done) => {
        clientSocket.emit("join_product", `product:${productId}`);
        clientSocket.on("comment:new", (data: any) => {
            expect(data).toHaveProperty("content", "Socket test comment");
            expect(data).toHaveProperty("displayName", "SocketUser");
            done();
        });

        request(httpServer)
            .post(`/api/v1/review/${productId}/comment`)
            .send({ content: "Socket test comment", displayName: "SocketUser" })
            .expect(201)
            .then((response) => {
                expect(response.body.data.comment.content).toBe("Socket test comment");
                expect(response.body.data.comment.displayName).toBe("SocketUser");
            });
    });
});
