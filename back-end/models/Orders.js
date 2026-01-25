//Orders.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
     email: {
        type: String,
        required: true
    },
    order_data: {
        type: Array,
        required: true,
    },
    order_date: {
        type: String,
        default: new Date().toDateString()
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'delivery_ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    location: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        },
        address: {
            type: String,
            default: 'Not provided'
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('order', OrderSchema)