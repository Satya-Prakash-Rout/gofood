const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/foodData', async (req, res) => {
  try {
    // Fetch fresh data from MongoDB
    const db = mongoose.connection.db;

    const foodItems = await db.collection("food_items").find({}).toArray();
    let foodCategories = await db.collection("foodcategory").find({}).toArray();

    if ((!foodCategories || foodCategories.length === 0) && foodItems.length > 0) {
      const uniqueCategories = [...new Set(
        foodItems
          .filter(item => item.CategoryName)
          .map(item => item.CategoryName.trim())
      )];

      foodCategories = uniqueCategories.map((CategoryName, index) => ({
        _id: `fallback-${index}`,
        CategoryName
      }));
    }

    // Update global variables for fallback
    global.food_items = foodItems;
    global.foodCategory = foodCategories;

    res.status(200).json([foodItems, foodCategories]);

  } catch (error) {
    console.error('Error fetching food data:', error.message);

    const fallbackFoodItems = global.food_items || [];
    let fallbackFoodCategories = global.foodCategory || [];

    if ((!fallbackFoodCategories || fallbackFoodCategories.length === 0) && fallbackFoodItems.length > 0) {
      const uniqueCategories = [...new Set(
        fallbackFoodItems
          .filter(item => item.CategoryName)
          .map(item => item.CategoryName.trim())
      )];

      fallbackFoodCategories = uniqueCategories.map((CategoryName, index) => ({
        _id: `fallback-${index}`,
        CategoryName
      }));
    }

    if (fallbackFoodItems.length > 0 || fallbackFoodCategories.length > 0) {
      res.status(200).json([fallbackFoodItems, fallbackFoodCategories]);
    } else {
      res.status(500).json({ error: "Failed to fetch food data" });
    }
  }
});

module.exports = router;
