const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const PortfolioSchema = new mongoose.Schema({
    balance: {
      type: Number,
      required: true,
    },
    stocks: {
        type: [ObjectId],
        ref: 'Stock',
        required: true,
    },
    buyingPower: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    transactions: {
        type: [ObjectId],
        ref: 'Transaction',
        required: true,
    },
  });

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

module.exports = Portfolio;