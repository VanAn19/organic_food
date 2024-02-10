const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const orderController = {
    showOrder: async (req,res)=>{
        try {
            const order = await Order.find().populate("cart");
            return res.status(200).json(order);
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    payCart: async (req,res)=>{
        try {
            const token = req.headers.token;
            if (token) {
                try {
                    const accessToken = token.split(" ")[1];
                    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                    const userCart = await Cart.find({ user: decoded.id });      
                    const order = new Order({
                        status: req.body.status,
                        cart: [], 
                        user: decoded.id,
                    });
                    for (const changeCart of userCart) {
                        changeCart.status = "01";
                        await changeCart.save();
                        order.cart.push(changeCart._id);
                        
                        const product = await Product.findById(changeCart.products);
                        product.quantity -= changeCart.quantity;
                        await product.save();
                    }
                    const saveOrder = await order.save();
                    return res.status(200).json(saveOrder);
                } catch(err) {
                    console.log(err);
                    return res.status(403).json("Token is not valid");
                }
            } else {
                return res.status(401).json("You are not authenticated");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = orderController;