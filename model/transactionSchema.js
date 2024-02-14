const mongoose = require("mongoose");
const Stock = require("./stockSchema");
const User = require("./userSchema");

const TransactionSchema = new mongoose.Schema({
  Stock: {
    type: Stock,
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
      type: User,
      required: true,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;