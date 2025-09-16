import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: "https://iampesmobile.com/uploads/user-avatar-taskify.jpg"
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['employee', 'manager', 'admin', 'not_assign'],
        default: 'not_assign',
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;