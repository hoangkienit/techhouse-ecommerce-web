import { NotFoundError } from "../core/error.response";
import UserRepo from "../repositories/user.repository";



class UserService {
    static async SetBanStatus(userId: string, status: boolean) {
        const user = await UserRepo.findById(userId);
        if(!user) throw new NotFoundError("Không tìm thấy người dùng");
        
        return await UserRepo.setBanStatus(userId, status);
    }
}

export default UserService;