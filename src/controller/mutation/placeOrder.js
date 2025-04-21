
const Customer = require('../../models/customer.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const mongoose = require('mongoose');
const { client } = require('../../db/redis');

async function placeOrder(_, { input }) {
    const { customerId, products } = input;

    for (const p of products) {
        if (!p.productId || typeof p.quantity !== 'number' || p.quantity <= 0) {
            throw new Error('Invalid product input: productId and quantity are required.');
        }

        const productExists = await Product.findOne({ _id: p.productId });
        if (!productExists) {
            throw new Error(`Product with ID ${p.productId} does not exist.`);
        }
    }

    const totalAmount = products.reduce(
        (sum, p) => sum + p.quantity * p.priceAtPurchase,
        0
    );

    const order = await Order.create({
        customerId,
        products,
        totalAmount,
        orderDate: new Date(),
        status: 'completed'
    });

    return order;
}

module.exports = placeOrder;