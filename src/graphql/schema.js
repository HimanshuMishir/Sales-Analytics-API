const { gql } = require('apollo-server-express');

module.exports = gql`

input PlaceOrderInput {
  customerId: String!
  products: [OrderProductInput!]!
}

input OrderProductInput {
  productId: String!
  quantity: Int!
  priceAtPurchase: Float!
}

type OrderProduct {
  productId: String!
  quantity: Int!
  priceAtPurchase: Float!
}

type Order {
  _id: ID
  customerId: String!
  products: [OrderProduct!]!
  totalAmount: Float!
  orderDate: String!
  status: String!
}

type CustomerSpending {
  customerId: String!
  totalSpent: Float!
  averageOrderValue: Float!
  lastOrderDate: String
}

type TopProduct {
  productId: String!
  name: String!
  totalSold: Int!
}

type SalesAnalytics {
  totalRevenue: Float!
  completedOrders: Int!
  categoryBreakdown: [CategoryRevenue!]!
}

type CategoryRevenue {
  category: String!
  revenue: Float!
}

  type Mutation {
      placeOrder(input: PlaceOrderInput!): Order!
    }

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    getCustomerOrders(customerId: String!, page: Int, limit: Int): [Order!]!
  }

`;