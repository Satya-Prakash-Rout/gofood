const express = require('express');
const router = express.Router();

router.post('/foodData', (req, res) => {
  try {
    if (!(global.food_items && global.foodCategory)) {
      throw new Error("food_items or foodCategory is not defined");
    }

    res.status(200).json([global.food_items, global.foodCategory]);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});

module.exports = router;
