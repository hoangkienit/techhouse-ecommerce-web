import { ICreateLoyaltyTransaction } from "../interfaces/loyalty.interface";
import Loyalty from "../models/loyalty.model";
import { Types, ClientSession } from "mongoose";

class LoyaltyRepo {
    static async create(payload: ICreateLoyaltyTransaction, session?: ClientSession) {
        const loyalty = new Loyalty({
            user: new Types.ObjectId(payload.userId),
            type: payload.type,
            points: payload.points,
            order: payload.orderId ? new Types.ObjectId(payload.orderId) : undefined,
        });

        if(session) {
            loyalty.$session(session);
        }

        return await loyalty.save();
    }

    static async findAll(userId: string) {
        return await Loyalty.find({ user: userId })
            .populate("order", "total status placedAt")
            .sort({ createdAt: -1 })
            .lean();
    }

    static async deleteByOrder(orderId: string) {
        return await Loyalty.deleteMany({ order: orderId });
    }
}

export default LoyaltyRepo;
