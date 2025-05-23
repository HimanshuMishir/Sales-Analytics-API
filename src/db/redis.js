const redis = require('redis');
require('dotenv').config();


const client = redis.createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

client.on('error', err => console.error('Redis Client Error', err));

client.connect();

module.exports = client;