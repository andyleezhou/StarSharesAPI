const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const StockSchema = new mongoose.Schema({
  stockId: {
    type: ObjectId,
    required: true,
  },
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
