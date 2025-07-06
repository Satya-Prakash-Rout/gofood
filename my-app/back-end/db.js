// db.js
const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://satyaprakashrout1117:satya1117@cluster0.u2avsxf.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
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
    console.error(" MongoDB connection failed:", error);
    process.exit(1); // optionally exit for fatal DB issues
  } finally {
    // Close the DB connection only if it's open

  }

};

module.exports = mongoDB;
