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
    let itemTotal = 0;
    
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new Error(`Product not found for ID: ${item.product}`);
        }
        if (!product.inStock) {
            throw new Error(`Product "${product.name}" is currently out of stock`);
        }
        itemTotal += product.offerPrice * item.quantity;
    }

    // Get delivery cost
    const address = await Address.findById(addressId);
    if (!address) {
        throw new Error('Delivery address not found');
    }
    
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
        console.log('Fetching orders for user:', userId);
        const orders = await Order.find({
            userId,
            isPaid: true
        })
        .populate({
            path: 'items.product',
            select: 'name image offerPrice price category'
        })
        .populate({
            path: 'address',
            select: 'firstName lastName street city state zipcode country phone'
        })
        .sort({createdAt: -1});
        
        console.log(`Found ${orders.length} orders for user`);
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        console.log('Fetching all orders for seller...');
        const orders = await Order.find({
            isPaid: true
        })
        .populate({
            path: 'items.product',
            select: 'name image offerPrice category'
        })
        .populate({
            path: 'address',
            select: 'firstName lastName street city state zipcode country phone'
        })
        .sort({createdAt: -1});
        
        console.log(`Found ${orders.length} orders`);
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status (for seller / admin) : /api/order/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        const validStatuses = ["Order Placed", "Processing", "Packed", "Dispatched", "Out for Delivery", "Delivered", "Cancelled", "Trash"];
        
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated", order });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Order (move to trash or permanent delete) : /api/order/delete
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: "Trash" },
            { new: true }
        );

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order moved to trash", order });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Permanently delete order : /api/order/permanent-delete
export const permanentDeleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order permanently deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}