const Cart = require('../models/Cart');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken')

const cartController = {
    addToCart: async (req, res) => {
        try {
            const product = await Product.findById(req.body.products);
            if (!product) {
                return res.status(404).json("Product is not available");
            }
            if (product.quantity < req.body.quantity) {
                return res.status(400).json("Product quantity is not enough");
            }
            const existingCart = await Cart.findOne({
                products: req.body.products,
                user: req.user.id,
            });
            if (existingCart && existingCart.status == "00") {
                existingCart.quantity += req.body.quantity;
                await existingCart.save();
            } else {
                const cart = new Cart(req.body);
                cart.user = req.user.id;
                await cart.save();
            }
            return res.status(200).json("Add product to cart successfully");
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    showCart: async (req, res) => {
        try {
            const userCart = await Cart.find({ user: req.user.id, status: "00" }).populate('products');
            if (userCart && userCart.products === 0) {
                await Cart.findOneAndDelete({ user: req.user.id });
            } 
            return res.status(200).json(userCart)
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    deleteCart: async (req, res) => {
        try {
            await Cart.findOneAndDelete({ user: req.user.id }, { _id: req.body.cartId });
            return res.status(200).json("Delete a cart successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = cartController;