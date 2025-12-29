import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    cartItems: { type: Object, default: {} },
}, { minimize: false })

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User