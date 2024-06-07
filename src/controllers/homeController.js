const Category = require('../models/Category');
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
            const category = await Category.findOne({ slug: req.params.slug });
            const products = await Product.find({ category: category._id }).populate("category");
            return res.status(200).json(products);
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
}

module.exports = homeController;