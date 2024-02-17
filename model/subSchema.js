const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    transactionDate: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    purchasingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
  });
  
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
  
  const PortfolioSchema = new mongoose.Schema({
    balance: {
      type: Number,
      required: true,
    },
    stocks: {
        type: [StockSchema],
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
        type: TransactionSchema,
        required: true,
    },
  });
module.exports = {
    TransactionSchema, StockSchema, PortfolioSchema,
}