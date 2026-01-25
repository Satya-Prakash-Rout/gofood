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

// POST /api/admin/delivery-ready - Mark order as delivery ready
router.post('/admin/delivery-ready', async (req, res) => {
    try {
        const { orderId } = req.body;

        // Validate orderId
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Update order status to delivery_ready
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                status: 'delivery_ready',
                updatedAt: new Date()
            },
            { new: true } // Return the updated document
        );

        // Check if order exists
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Emit real-time update to connected clients
        if (req.app.io) {
            req.app.io.emit('order:delivery-ready', {
                orderId: updatedOrder._id,
                status: updatedOrder.status,
                email: updatedOrder.email
            });
        }

        res.status(200).json({
            success: true,
            message: "Order marked as delivery ready",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({
            success: false,
            error: "Server Error",
            message: error.message
        });
    }
});

// POST /api/admin/update-order-status - Update order status to any allowed status
router.post('/admin/update-order-status', async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Validate inputs
        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required"
            });
        }

        // Validate status
        const validStatuses = ['pending', 'preparing', 'delivery_ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed statuses: " + validStatuses.join(', ')
            });
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                status: status,
                updatedAt: new Date()
            },
            { new: true }
        );

        // Check if order exists
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Emit real-time update to connected clients
        if (req.app.io) {
            req.app.io.emit('order:status-updated', {
                orderId: updatedOrder._id,
                status: updatedOrder.status,
                email: updatedOrder.email
            });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({
            success: false,
            error: "Server Error",
            message: error.message
        });
    }
});

module.exports = router;
