const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./db/connect');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    await connectDB();

    return app;
};

module.exports = startServer;