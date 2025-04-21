const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    _id: String, // <-- treat _id as string (UUID)
    name: String,
    email: String,
    age: Number,
    location: String,
    gender: String,
});

module.exports = mongoose.model('Customer', customerSchema);