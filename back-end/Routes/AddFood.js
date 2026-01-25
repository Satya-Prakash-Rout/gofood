const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Food = require('../models/Food');

// Add food endpoint
router.post('/addfood', async (req, res) => {
  

  try {
    const { name, CategoryName, description, halfPrice, fullPrice, imgUrl } = req.body;

    

      // Validation
      if (!name || !CategoryName || !halfPrice || !fullPrice || !imgUrl) {
        return res.status(400).json({ error: 'Name, category, prices, and image URL are required' });
      }

      const halfPriceNum = parseFloat(halfPrice);
      const fullPriceNum = parseFloat(fullPrice);

      if (isNaN(halfPriceNum) || halfPriceNum <= 0 || isNaN(fullPriceNum) || fullPriceNum <= 0) {
        return res.status(400).json({ error: 'Prices must be valid positive numbers' });
      }

      if (fullPriceNum <= halfPriceNum) {
        return res.status(400).json({ error: 'Full price must be greater than half price' });
      }

      // Validate URL
      try {
        new URL(imgUrl);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid image URL' });
      }

      // Create food object with options as ARRAY with object at index 0
      const foodData = {
        name: name.trim(),
        CategoryName: CategoryName.trim(),
        description: description ? description.trim() : '',
        img: imgUrl.trim(),
        options: [
          {
            half: halfPriceNum.toString(),
            full: fullPriceNum.toString()
          }
        ]
      };

      // Save to MongoDB food_items collection
      const db = mongoose.connection.db;
      const result = await db.collection("food_items").insertOne(foodData);
      
      console.log('Food added successfully to MongoDB:', foodData);
      

      // Update global array to reflect the change
      foodData._id = result.insertedId;
      if (!global.food_items) {
        global.food_items = [];
      }
      global.food_items.push(foodData);

      // Emit Socket.IO event to notify all connected clients
      const io = require('express').application.io || req.app.io;
      if (io) {
        io.emit('foodAdded', {
          success: true,
          food: foodData
        });
        
      }

      res.status(201).json({
        success: true,
        message: 'Food item added successfully',
        food: foodData
      });
    } catch (error) {
      console.error('Error in AddFood:', error);
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Get all food items
router.get('/getfoods', (req, res) => {
  try {
    if (!global.food_items) {
      global.food_items = [];
    }
    res.status(200).json({
      success: true,
      foods: global.food_items
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Server error while fetching food items' });
  }
});

// Delete food item
router.delete('/deletefood/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!global.food_items) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    const itemIndex = global.food_items.findIndex(item => item.id === parseInt(id));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    global.food_items.splice(itemIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: 'Server error while deleting food item' });
  }
});

module.exports = router;
