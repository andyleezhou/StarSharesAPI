const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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
    stockID: {
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
    TransactionSchema, StockSchema, PortfolioSchema, Stock
}