const Cart = require('../models/Cart');
const Product = require('../models/Product');

const adminController = {
    addProduct: async (req,res)=>{
        try {
            const newProduct = new Product(req.body);
            // if (req.file) {
            //     newProduct.image = req.file.path;
            // }
            if (req.files) {
                let path = '';
                req.files.forEach(function (files, index, arr) {
                    path = path + files.path + ',';
                });
                path = path.substring(0, path.lastIndexOf(','));
                newProduct.image = path;
            }
            const saveProduct = await newProduct.save();
            return res.status(200).json(saveProduct);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    updateProduct: async (req,res)=>{
        try {
            const product = await Product.findById(req.params.id);
            await product.updateOne({ $set: req.body });
            res.status(200).json("Update successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    },
    deleteProduct: async (req,res)=>{
        try {
            await Cart.updateMany(
                { products: req.params.id },
                { $pull: { products: req.params.id } }
            );
            await Product.delete({ _id: req.params.id });
            res.status(200).json("Delete successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    },
    getTrash: async (req,res)=>{
        try {
            const trash = await Product.findDeleted();
            res.status(200).json(trash);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    restoreProduct: async (req,res)=>{
        try {
            await Product.restore({ _id: req.params.id });
            res.status(200).json("Restore successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = adminController;