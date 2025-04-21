const getSalesAnalytics = require('../controller/query/getSalesAnalytics');
const getTopSellingProducts = require('../controller/query/getTopSellingProducts');
const getCustomerSpending = require('../controller/query/getCustomerSpending');
const getCustomerOrders = require('../controller/query/getCustomerOrders');
const placeOrder = require('../controller/mutation/placeOrder');



const resolvers = {
    Query: {
        getCustomerSpending,
        getTopSellingProducts,
        getSalesAnalytics,
        getCustomerOrders,
    },
    Mutation: {
        placeOrder,
    }
};

module.exports = resolvers;