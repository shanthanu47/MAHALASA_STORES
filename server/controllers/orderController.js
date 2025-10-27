import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import razorpay from "../configs/razorpay.js";
import crypto from "crypto";
import { calculateDeliveryCost } from "../configs/importPincodes.js";

// Helper function to calculate order amounts
const calculateOrderAmounts = async (items, addressId) => {
    // Calculate item total
    let itemTotal = await items.reduce(async (acc, item) => {
        const product = await Product.findById(item.product);
        return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Get delivery cost
    const address = await Address.findById(addressId);
    let deliveryCost = 0;
    let totalAmount = itemTotal;

    try {
        const deliveryInfo = await calculateDeliveryCost(address.zipcode);
        deliveryCost = deliveryInfo.deliveryCost;
        totalAmount = itemTotal + deliveryCost;
    } catch (error) {
        console.log('Delivery cost calculation failed:', error.message);
        // Continue with zero delivery cost if pincode not found
    }

    return {
        itemTotal,
        deliveryCost,
        totalAmount
    };
};

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { items, address } = req.body;

        const amounts = await calculateOrderAmounts(items, address);

        // Use the total amount without any processing fee
        const razorpayAmount = amounts.totalAmount;

        const options = {
            amount: razorpayAmount * 100,
            currency: "INR",
        };
        
        const order = await razorpay.orders.create(options);
        
        res.json({
            success: true,
            order,
            amounts: {
                itemTotal: amounts.itemTotal,
                deliveryCost: amounts.deliveryCost,
                totalAmount: razorpayAmount
            }
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.json({ success: false, message: `Error creating Razorpay order: ${error.message}` });
    }
};

// Place Order Online : /api/order/online
export const placeOrderOnline = async (req, res) => {
    try {
        const { userId, items, address, paymentDetails } = req.body;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const amounts = await calculateOrderAmounts(items, address);
            const finalAmount = amounts.totalAmount; // No processing fee

            const newOrder = await Order.create({
                userId,
                items,
                amount: amounts.itemTotal,
                deliveryCost: amounts.deliveryCost,
                totalAmount: finalAmount,
                address,
                payment: true,
                paymentDetails,
                paymentType: "Online",
                isPaid: true,
            });

            res.json({
                success: true,
                message: "Order Placed Successfully",
                orderId: newOrder._id,
                amounts: {
                    itemTotal: amounts.itemTotal,
                    deliveryCost: amounts.deliveryCost,
                    processingFee: 0, // Removed processing fee
                    totalAmount: finalAmount
                }
            });
        } else {
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const userId = req.body.userId;
        const orders = await Order.find({
            userId,
            isPaid: true
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        const orders = await Order.find({
            isPaid: true
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}