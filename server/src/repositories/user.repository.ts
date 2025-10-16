import Address from "../models/address.model";
import User from "../models/user.model";



class UserRepo {
    static async findByEmail(email: string) {
        return User.findOne({ email }).exec();
    }

    static async findById(id: string) {
        return User.findById(id).populate("addresses").exec();
    }

    static async findByPhone(phone: string) {
        return User.findOne({ phone }).exec();
    }

    static async create(data: {
        fullname: string;
        email: string;
        password: string;
    }) {
        const user = new User({
            fullname: data.fullname,
            email: data.email,
            password: data.password,
            addresses: []
        });

        return await user.save();
    }

    static async addAddress(userId: string, addressData: {
        street: string;
        city: string;
        state?: string;
        country: string;
        isDefault?: boolean;
    }) {
        const address = new Address({
            userId,
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
            isDefault: addressData.isDefault ?? false
        });

        const savedAddress = await address.save();

        await User.findByIdAndUpdate(userId, {
            $push: { addresses: savedAddress._id }
        });

        return savedAddress;
    }

    static async setBanStatus(userId: string, status: boolean) {
        return User.findByIdAndUpdate(userId, { isBanned: status }, { new: true }).exec();
    }
}

export default UserRepo;