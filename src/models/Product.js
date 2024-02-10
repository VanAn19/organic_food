const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    price: {
        type: Number,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        require: true,
        unique: true,
    },
    preservation: {
        type: String,
        require: true,
    },
    howToUse: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true,
    }
}, {
    timestamps: true,
});

mongoose.plugin(slug);

productSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Product', productSchema);