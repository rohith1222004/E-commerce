const User = require('../models/User');
const Product = require('../models/Product');
const { addCart } = require('../services/cartService');

const getItems = async(req, res) => {
    if(req.isAuthenticated){
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.send(user.cart)
    }
    else{
        const cart = req.session.cart || { items: [] };
        return res.json(cart)
    }
}


const addToCart = async(req, res) => {
    const { productId, quantity } = req.body;

    if (req.isAuthenticated) {
        const userId = req.user.userId;
        console.log(userId);
        
        addCart(userId, productId, quantity)

        return res.send("successfully added to cart")
    }
    else{
        let cart = req.session.cart || { items: [] };
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        req.session.cart = cart;
        return res.send("successfully added to cart")
    }
}

const removeFromCart = async(req, res) => {
    const { productId } = req.body;
    const {quantity} = req.body || 1;

    if(req.isAuthenticated){
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity -= quantity;
        if (cartItem.quantity <= 0) {
            user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        }

        await user.save();

        return res.send("successfully removed from cart")
    }

    else{
        const cart = req.session.cart || { items: [] };
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity -= quantity;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }
        req.session.cart = cart;
        return res.send("successfully removed from cart")
    }
}

const clearCart = async(req, res) => {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.cart = [];
    await user.save();
    return res.send("successfully cleared cart")
}

module.exports={
    getItems,
    addToCart,
    removeFromCart,
    clearCart
}