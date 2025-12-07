import User from "../models/User.js"

// Add to Cart : /api/cart/add
export const addToCart = async (req, res) => {
    try {
        let userData = await User.findById(req.body.userId);
        let cartData = userData.cartItems;
        if (!cartData[req.body.product]) {
            cartData[req.body.product] = 1
        } else {
            cartData[req.body.product] += 1
        }
        await User.findByIdAndUpdate(req.body.userId, { cartItems: cartData });
        res.json({ success: true, message: "Added to Cart", cart: cartData })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Remove from Cart : /api/cart/remove
export const removeFromCart = async (req, res) => {
    try {
        let userData = await User.findById(req.body.userId);
        let cartData = userData.cartItems;
        if (cartData[req.body.product] > 0) {
            cartData[req.body.product] -= 1
        }
        // Remove item from cart if quantity is 0
        if (cartData[req.body.product] === 0) {
            delete cartData[req.body.product];
        }
        await User.findByIdAndUpdate(req.body.userId, { cartItems: cartData });
        res.json({ success: true, message: "Removed from Cart", cart: cartData })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Cart : /api/cart/all
export const getCart = async (req, res) => {
    try {
        let userData = await User.findById(req.body.userId);
        let cartData = userData.cartItems;
        res.json({ success: true, cart: cartData })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Clear Cart : /api/cart/clear
export const clearCart = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, { cartItems: {} });
        res.json({ success: true, message: "Cart Cleared", cart: {} })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
