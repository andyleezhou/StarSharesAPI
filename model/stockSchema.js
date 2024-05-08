const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
  },
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
    required: true,
    default: 1000,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
