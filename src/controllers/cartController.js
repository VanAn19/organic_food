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
                user: req.body.user,
            });
            if (existingCart && existingCart.status == "00") {
                existingCart.quantity += req.body.quantity;
                await existingCart.save();
            } else {
                const cart = new Cart(req.body);
                await cart.save();
                // const savedCart = await cart.save();
                // if (req.body.status === "00") {
                //     const oldCart = Cart.find({ status: "00" });
                //     await oldCart.updateOne({ $push: { products: savedCart._id } });
                // }
            }
            // await Product.findByIdAndUpdate(req.body.products, { $inc: { quantity: -req.body.quantity } });
            return res.status(200).json("Add product to cart successfully");
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    showCart: async (req, res) => {
        try {
            const token = req.headers.token;
            if (token) {
                try {
                    const accessToken = token.split(" ")[1];
                    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                    const userCart = await Cart.find({ user: decoded.id, status: "00" }).populate('products');
                    // if (userCart && userCart.products === 0) {
                    //     await Cart.findOneAndDelete({ user: decoded.id });
                    // }
                    res.status(200).json(userCart);
                } catch(err) {
                    console.log(err);
                    res.status(403).json("Token is not valid");
                }
            } else {
                res.status(401).json("You're not authenticated");
            }
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    deleteCart: async (req, res) => {
        try {
            const token = req.headers.token;
            if (token) {
                try {
                    const accessToken = token.split(" ")[1];
                    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                    await Cart.findOneAndDelete({ user: decoded.id }, { _id: req.params.id });
                    res.status(200).json("Delete a cart successfully");
                } catch(err) {
                    res.status(401).json("Token is not valid");
                }
            } else {
                res.status(401).json("You're not authenticated");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = cartController;