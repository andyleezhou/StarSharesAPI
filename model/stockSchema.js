const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  artistName: {
    type: String,
    required: true,
  },
  artistImage: {
    type: String,
    required: false,
  },
  cost: {
    type: Number,
    default: 100,
    required: true,
  },
  quantity: {
    type: Number,
    required: false,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
