import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, default: null },
    fullName: { type: String, default: null },
    phone: { type: String, default: null },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: null },
    postalCode: { type: String, default: null },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
