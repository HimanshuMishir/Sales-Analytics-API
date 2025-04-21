
const Customer = require('../../models/customer.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const mongoose = require('mongoose');
const { client } = require('../../db/redis');

 async function getCustomerOrders(_, { customerId, page = 1, limit = 5 }) {
    const skip = (page - 1) * limit;
    const orders = await Order.find(
        { customerId },
        { _id: 1, customerId: 1, products: 1, totalAmount: 1, orderDate: 1, status: 1 }
    )
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit);
        console.log('Customer Orders:', orders);
    return orders;
}
module.exports = getCustomerOrders;