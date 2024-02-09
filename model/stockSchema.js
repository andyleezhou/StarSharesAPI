const mongoose = require("mongoose");
const Artist = require('./artistSchema')

const StockSchema = new mongoose.Schema({
  artist: {
    type: Artist,
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