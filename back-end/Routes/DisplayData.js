const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/foodData', async (req, res) => {
  try {
    // Fetch fresh data from MongoDB
    const db = mongoose.connection.db;
    
    const foodItems = await db.collection("food_items").find({}).toArray();
    const foodCategories = await db.collection("foodcategory").find({}).toArray();

    // Update global variables for fallback
    global.food_items = foodItems;
    global.foodCategory = foodCategories;

    
    
    res.status(200).json([foodItems, foodCategories]);

  } catch (error) {
    console.error('Error fetching food data:', error.message);
    
    // Fallback to global variables if MongoDB fails
    if (global.food_items && global.foodCategory) {
      res.status(200).json([global.food_items, global.foodCategory]);
    } else {
      res.status(500).json({ error: "Failed to fetch food data" });
    }
  }
});

module.exports = router;
