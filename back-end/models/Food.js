const mongoose = require('mongoose');
const { Schema } = mongoose;

const FoodSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  CategoryName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  options: {
    type: Schema.Types.Mixed,
    default: { full: '0' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('food', FoodSchema);
