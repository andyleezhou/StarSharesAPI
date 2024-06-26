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
    required: true,
  },
  quantity: {
    type: Number,
    required: false,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
