
const Customer = require('../../models/customer.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const mongoose = require('mongoose');
const { client } = require('../../db/redis');

async function getCustomerSpending(_, { customerId }) {
    console.log('Customer ID:', customerId);


    const result = await Order.aggregate([
        { $match: { customerId: customerId, status: 'completed' } },
        {
            $lookup: {
                from: 'customers',
                localField: 'customerId',
                foreignField: '_id',
                as: 'customerInfo'
            }
        },
        { $unwind: '$customerInfo' },
        {
            $group: {
                _id: '$customerId',
                name: { $first: '$customerInfo.name' },
                totalSpent: { $sum: '$totalAmount' },
                averageOrderValue: { $avg: '$totalAmount' },
                orderDate: { $max: '$orderDate' }
            }
        }
    ]);


    console.info('Customer Spending Result:', result);

    if (result.length === 0) return null;

    const data = result[0];
    return {
        customerId,
        name:data.name,
        totalSpent: data.totalSpent,
        averageOrderValue: data.averageOrderValue,
        lastOrderDate: data.orderDate.toISOString(),
    };
}
module.exports = getCustomerSpending;