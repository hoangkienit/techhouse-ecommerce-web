import { ICreateLoyaltyTransaction } from "../interfaces/loyalty.interface";
import LoyaltyRepo from "../repositories/loyalty.repository";



class LoyaltyService {
    static async CreateLoyaltyTransaction(payload: ICreateLoyaltyTransaction) {
        return await LoyaltyRepo.create(payload);
    }

    static async GetUserTransactions(userId: string) {
        return await LoyaltyRepo.findAll(userId);
    }

    static async DeleteByOrder(orderId: string) {
        return await LoyaltyRepo.deleteByOrder(orderId);
    }
}

export default LoyaltyService;