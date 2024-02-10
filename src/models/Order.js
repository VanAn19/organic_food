const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    status: {
        type: String, 
        require: true,
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
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

module.exports = mongoose.model("Order", orderSchema);