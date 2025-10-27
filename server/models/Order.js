import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: 'user'},
    items: [{
        product: {type: String, required: true, ref: 'product'},
        quantity: {type: Number, required: true}
    }],
    amount: {type: Number, required: true},
    deliveryCost: {type: Number, default: 0},
    totalAmount: {type: Number, required: true}, // amount + deliveryCost
    address: {type: String, required: true, ref: 'address'},
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false },
    paymentDetails: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String },
    },
    paymentType: {type: String, required: true},
    isPaid: {type: Boolean, required: true, default: false},
},{ timestamps: true })

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order