const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// POST /api/auth/orderData - Save new order or update existing
router.post('/orderData', async (req, res) => {
    const { email, order_data, order_date, location } = req.body;

    if (!email || !order_data || !order_date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let existingOrder = await Order.findOne({ email });

        if (!existingOrder) {
            // Create new order document
            await Order.create({
                email,
                order_data: [order_data],
                order_date,
                location: location || {
                    latitude: null,
                    longitude: null,
                    address: 'Not provided',
                    city: '',
                    state: ''
                }
            });

        } else {
            // Update existing document with new order and location
            await Order.findOneAndUpdate(
                { email },
                { 
                    $push: { order_data: order_data },
                    location: location || {
                        latitude: null,
                        longitude: null,
                        address: 'Not provided',
                        city: '',
                        state: ''
                    }
                }
            );
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("Error saving order:", error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
});


// POST /api/auth/myOrderData - Retrieve orders for a user
router.post('/myOrderData', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const myData = await Order.findOne({ email });

        if (!myData) {
            return res.status(404).json({ message: "No orders found for this email" });
        }

        res.status(200).json({ orderData: myData });

    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
});

module.exports = router;
