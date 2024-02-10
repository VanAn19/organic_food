const Product = require('../models/Product');

const productController = {
    showProduct: async (req, res) => {
        try {
            const product = await Product.find({ slug: req.params.slug });
            return res.status(200).json(product);
        } catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    searchProduct: async (req,res)=> {
        try {
            let data = await Product.find({
                "$or": [
                    {name: {$regex: req.params.value}}
                ]
            }).exec();
            console.log(data);
            res.status(200).json(data);
        } catch(err) {
            res.status(500).json();
        }
    }
}

module.exports = productController;