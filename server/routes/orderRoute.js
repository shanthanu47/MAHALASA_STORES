import express from 'express';
import authUser from '../middlewares/authUser.js';
import {
    placeOrderOnline,
    getUserOrders,
    createRazorpayOrder,
    getAllOrders
} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

// User Routes

orderRouter.post('/online', authUser, placeOrderOnline);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.post('/create-razorpay-order', authUser, createRazorpayOrder);

// Seller Routes
orderRouter.get('/seller', authSeller, getAllOrders);

export default orderRouter;