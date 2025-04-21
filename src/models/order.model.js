const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: String,
    products: [
        {
            productId: String,
            quantity: Number,
            priceAtPurchase: Number,
        },
    ],
    totalAmount: Number,
    orderDate: Date,
    status: String,
});

module.exports = mongoose.model('Order', orderSchema);