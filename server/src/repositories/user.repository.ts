import { IUser } from "../interfaces/user.interface";
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

    static async findByToken(token: string) {
        return User.findOne({ "properties.resetToken": token }).exec();
    }

    static async create(data: Partial<IUser>) {
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
        postalCode?: string;
        country: string;
        label?: string;
        fullName?: string;
        phone?: string;
        isDefault?: boolean;
    }) {
        if (addressData.isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        const address = new Address({
            userId,
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country,
            label: addressData.label ?? null,
            fullName: addressData.fullName ?? null,
            phone: addressData.phone ?? null,
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
