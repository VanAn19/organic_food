const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');

const adminController = {
    addProduct: async (req,res)=>{
        try {
            const newProduct = new Product(req.body);
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
    getProductTrash: async (req,res)=>{
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
    },
    showCategory: async (req,res) => {
        try {
            const categories = await Category.find();
            return res.status(200).json(categories);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    addCategory: async (req,res) => {
        try {
            const newCategory = new Category(req.body);
            const saveCategory = await newCategory.save();
            return res.status(200).json(saveCategory);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    updateCategory: async (req,res) => {
        try {
            const category = await Category.findById(req.params.id);
            await category.updateOne({ $set: req.body });
            res.status(200).json("Update successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    },
    deleteCategory: async (req,res) => {
        try {
            await Category.delete({ _id: req.params.id });
            res.status(200).json("Delete successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    },
    getCategoryTrash: async (req,res)=>{
        try {
            const trash = await Category.findDeleted();
            res.status(200).json(trash);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    restoreCategory: async (req,res)=>{
        try {
            await Category.restore({ _id: req.params.id });
            res.status(200).json("Restore successfully");
        } catch(err) {
            res.status(500).json(err);
        }
    },
}

module.exports = adminController;