import express from "express"
import authUser from "../middlewares/authUser.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";


const cartRouter = express.Router();

cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/remove', authUser, removeFromCart)
cartRouter.get('/all', authUser, getCart)


export default cartRouter;