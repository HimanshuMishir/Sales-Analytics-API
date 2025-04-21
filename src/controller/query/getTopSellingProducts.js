
const Customer = require('../../models/customer.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const mongoose = require('mongoose');
const { client } = require('../../db/redis');

async function getTopSellingProducts(_, { limit }) {

    const result = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $unwind: '$products' },
        {
            $group: {
                _id: '$products.productId',
                totalSold: { $sum: '$products.quantity' }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        { $unwind: '$productInfo' },
        {
            $project: {
                productId: '$_id',
                name: '$productInfo.name',
                totalSold: 1,
                _id: 0
            }
        }
    ]);

    return result;
}

module.exports = getTopSellingProducts;