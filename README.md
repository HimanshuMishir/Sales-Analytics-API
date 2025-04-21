# 📊 Sales Analytics API

A Node.js GraphQL backend for managing customers, products, and orders. This application provides insightful analytics such as top-selling products, customer spending, and category-wise revenue breakdowns.

---

## 🚀 Features

- 🔍 Query top-selling products
- 🧾 Get customer spending summaries
- 📦 Place orders with product verification
- 📈 Get sales analytics with category breakdown
- 📄 Paginate customer order history
- ⚡️ Caching for analytics with Redis

---

## 📁 Folder Structure

```
src/
├── controller/
│   ├── mutation/
|   |   └── placeOrder.js
│   └── query/
|       ├──getCustomerOrders.js
|       ├──getCustomerSpending.js
|       ├──getSalesAnalytics.js
|       └── getTopSellingProducts.js
├── graphql/
│   ├── resolvers.js         # GraphQL resolvers
|   └── schema.js
├── models/
│   ├── customer.model.js
│   ├── product.model.js
│   └── order.model.js
├── db/
│   ├── mongo.js             # MongoDB connection
│   └── redis.js             # Redis client setup
├── app.js                   # Express + Apollo server setup
└── server.js                # Entry point
```

---

## 📦 Tech Stack

- **Node.js**, **Express**
- **Apollo Server (GraphQL)**
- **MongoDB + Mongoose**
- **Redis** (for caching)
- **Nodemon** (for dev)

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/HimanshuMishir/Sales-Analytics-API.git
cd Sales-Analytics-API

# 2. Install dependencies
npm install

# 3. Set up your .env file
cp .env.example .env
```

`.env` example:
```env
PORT=4000
MONGODB_URI = <Mongo DB URL with db name>
REDIS_HOST = <REDIS HOST URL>
REDIS_PORT = <REDIS PORT>
REDIS_USERNAME = <username>
REDIS_PASSWORD = <password>

```

```bash
# 4. Start the server
npm start
```

---

## 🧪 Sample GraphQL Queries

Paste into Apollo Studio or GraphQL Playground:

```graphql
query {
  getTopSellingProducts(limit: 5) {
    name
    totalSold
  }
}
```

For more sample queries, check the `queries.graphql` file.

---

## 📌 Bonus Features Implemented

✅ Pagination for `getCustomerOrders`  
✅ Redis caching for `getSalesAnalytics`  
✅ `placeOrder` mutation with validation  
✅ Sample GraphQL queries included

---


---

## 👨‍💻 Author

**Himanshu Mishra**  
Full-stack Developer | [LinkedIn](https://www.linkedin.com/in/himanshumishir/)

