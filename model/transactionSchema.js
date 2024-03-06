const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const TransactionSchema = new mongoose.Schema({
    stockId: {
      type: ObjectId,
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
        type: ObjectId,
        ref: 'User',
        required: true,
    },
  });

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
