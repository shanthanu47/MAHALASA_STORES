import express from "express"
import authUser from "../middlewares/authUser.js";
import { addToCart, getCart, removeFromCart, clearCart } from '../controllers/cartController.js';


const cartRouter = express.Router();

cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/remove', authUser, removeFromCart)
cartRouter.get('/all', authUser, getCart)
cartRouter.post('/clear', authUser, clearCart)


export default cartRouter;