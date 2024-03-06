const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  artistName: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
