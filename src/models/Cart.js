const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    status: {
        type: String,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true,
});


module.exports = mongoose.model('Cart', cartSchema);