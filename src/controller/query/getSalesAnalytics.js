
const Customer = require('../../models/customer.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const mongoose = require('mongoose');
const client  = require('../../db/redis');

async function getSalesAnalytics(_, { startDate, endDate }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const cacheKey = `analytics:${start.toISOString()}-${end.toISOString()}`;

    const cached = await client.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const result = await Order.aggregate([
        {
            $match: {
                status: { $regex: /^completed$/i },
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

    const finalResult = {
        totalRevenue: revenueData.totalRevenue,
        completedOrders: revenueData.completedOrders,
        categoryBreakdown: summary.categoryBreakdown
    };

    await client.setEx(cacheKey, 300, JSON.stringify(finalResult));
    return finalResult;
}

module.exports = getSalesAnalytics;