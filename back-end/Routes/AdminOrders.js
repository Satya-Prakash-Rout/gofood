const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// POST /api/admin/allOrders - Get all orders with user locations (Admin only)
router.post('/admin/allOrders', async (req, res) => {
    try {
        // Get all orders with location information
        const allOrders = await Order.find({}, {
            email: 1,
            order_data: 1,
            order_date: 1,
            location: 1,
            createdAt: 1
        }).sort({ createdAt: -1 });

        if (!allOrders || allOrders.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No orders found",
                orders: [] 
            });
        }

        res.status(200).json({ 
            success: true, 
            orders: allOrders 
        });

    } catch (error) {
        console.error("Error fetching all orders:", error.message);
        res.status(500).json({ 
            error: "Server Error", 
            message: error.message 
        });
    }
});

// POST /api/admin/ordersByLocation - Get orders with specific location criteria
router.post('/admin/ordersByLocation', async (req, res) => {
    const { city, state } = req.body;

    try {
        let query = {};

        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }
        if (state) {
            query['location.state'] = { $regex: state, $options: 'i' };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: orders.length,
            orders: orders 
        });

    } catch (error) {
        console.error("Error fetching orders by location:", error.message);
        res.status(500).json({ 
            error: "Server Error", 
            message: error.message 
        });
    }
});

module.exports = router;
