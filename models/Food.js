const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  carbohydrates: {
    type: Number,
    required: true
  },
  sugars: {
    type: Number,
    required: true
  },
  glycemicIndex: Number,
  calories: Number,
  portion: {
    amount: Number,
    unit: String
  },
  category: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const consumptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalCarbs: Number,
  totalSugars: Number,
  insulinRecommendation: String,
  medicationRecommendation: String,
  consumedAt: {
    type: Date,
    default: Date.now
  }
});

const Food = mongoose.model('Food', foodSchema);
const Consumption = mongoose.model('Consumption', consumptionSchema);

module.exports = { Food, Consumption };
