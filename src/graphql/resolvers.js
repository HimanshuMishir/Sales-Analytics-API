const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');




const resolvers = {
    Query: {
        async getCustomerSpending(_, { customerId }) {
            console.log('Customer ID:', customerId);
            

            const result = await Order.aggregate([
                { $match: { customerId: customerId, status: 'completed'} },
                {
                    $group: {
                        _id: '$customerId',
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
                totalSpent: data.totalSpent,
                averageOrderValue: data.averageOrderValue,
                lastOrderDate: data.orderDate.toISOString(),
            };
        },

        async getTopSellingProducts(_, { limit }) {

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
        },

        async getSalesAnalytics(_, { startDate, endDate }) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const result = await Order.aggregate([
                {
                    $match: {
                        status: 'completed',
                        orderDate: { $gte: start, $lte: end }
                    }
                },
                {
                    $facet: {
                        revenueSummary: [
                            {
                                $group: {
                                    _id: null,
                                    totalRevenue: { $sum: '$totalAmount' },
                                    completedOrders: { $sum: 1 }
                                }
                            }
                        ],
                        categoryBreakdown: [
                            { $unwind: '$products' },
                            {
                                $lookup: {
                                    from: 'products',
                                    localField: 'products.productId',
                                    foreignField: '_id',
                                    as: 'productDetails'
                                }
                            },
                            { $unwind: '$productDetails' },
                            {
                                $group: {
                                    _id: '$productDetails.category',
                                    revenue: {
                                        $sum: {
                                            $multiply: [
                                                '$products.quantity',
                                                '$products.priceAtPurchase'
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    category: '$_id',
                                    revenue: 1,
                                    _id: 0
                                }
                            }
                        ]
                    }
                }
            ]);

            const summary = result[0];
            const revenueData = summary.revenueSummary[0] || { totalRevenue: 0, completedOrders: 0 };

            return {
                totalRevenue: revenueData.totalRevenue,
                completedOrders: revenueData.completedOrders,
                categoryBreakdown: summary.categoryBreakdown
            };
        }
    }
};

module.exports = resolvers;