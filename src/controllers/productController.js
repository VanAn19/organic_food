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
            let data = await Product.find({ name: { $regex: ".*" + req.params.value + ".*" }});
            console.log(data);
            return res.status(200).json(data);
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}

module.exports = productController;