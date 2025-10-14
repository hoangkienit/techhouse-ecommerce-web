import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ''
    },
    profileImg: {
        type: String,
        default: "https://iampesmobile.com/uploads/user-avatar-taskify.jpg"
    },
     role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
     },
     socialProvider: {
        type: String,
        enum: ["google", "facebook", "github", "apple"],
        default: null
    },
    socialId: {
        type: String,
        default: null
    },
    addresses: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true }],
        default: []
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;