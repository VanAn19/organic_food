const Product = require('../models/Product');

const homeController = {
    showHome: async (req, res) => {
        try {
            const products = await Product.find();
            return res.status(200).json(products);
        } catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = homeController;