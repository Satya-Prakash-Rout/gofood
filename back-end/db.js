// db.js
const mongoose = require('mongoose');



const mongoDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" MongoDB connected");

    // Replace with your actual collection name
    const fetched_data = await mongoose.connection.db
      .collection("food_items")
      .find({})
      .toArray();
     const catData = await mongoose.connection.db
      .collection("foodcategory")
      .find({})
      .toArray(); 

    global.food_items = fetched_data;
    console.log(global.food_items);
    
    global.foodCategory = catData;
    console.log(global.foodCategory);

  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    console.warn(" Please check your internet connection or MongoDB credentials.");
    
    // Initialize empty arrays if connection fails
    global.food_items = [];
    global.foodCategory = [];
  } finally {
    // Close the DB connection only if it's open

  }

};

module.exports = mongoDB;
