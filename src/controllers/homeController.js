const Product = require('../models/Product');

const homeController = {
    showHome: async (req, res) => {
        try {
            const products = await Product.find().populate("category");
            return res.status(200).json(products);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    showProductByCategory: async (req, res) => {
        try {
            const product = await Product.find({ slug: req.params.slug });
            return res.status(200).json(product);
        } catch(err) {
            res.status(500).json(err);
        }
    },
}

module.exports = homeController;