import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
        type: [addressSchema],
        default: []
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;