// db.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI ;

const mongoDB = async () => {
  if (!mongoURI) {
    const message = 'MONGODB_URI is not set. Create back-end/.env from back-end/.env.example';
    console.error(` ${message}`);
    global.food_items = [];
    global.foodCategory = [];

    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    }
    return;
  }

  try {
    await mongoose.connect(mongoURI);

    console.log(" MongoDB connected");

    const fetched_data = await mongoose.connection.db
      .collection("food_items")
      .find({})
      .toArray();

    let catData = await mongoose.connection.db
      .collection("foodcategory")
      .find({})
      .toArray();

    if ((!catData || catData.length === 0) && fetched_data.length > 0) {
      const uniqueCategories = [...new Set(
        fetched_data
          .filter(item => item.CategoryName)
          .map(item => item.CategoryName.trim())
      )];

      catData = uniqueCategories.map((CategoryName, index) => ({
        _id: `fallback-${index}`,
        CategoryName
      }));
    }

    global.food_items = fetched_data;
    global.foodCategory = catData;

  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    console.warn(" Please check your internet connection or MongoDB credentials.");
    
    // Initialize empty arrays if connection fails
    global.food_items = [];
    global.foodCategory = [];

    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  } finally {
    // Close the DB connection only if it's open

  }

};

module.exports = mongoDB;
