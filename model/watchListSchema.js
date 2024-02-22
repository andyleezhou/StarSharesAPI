const mongoose = require("mongoose");

const WatchListSchema = new mongoose.Schema({
    user: {
        type: [userSchema],
        required: true,
    },
    stocks: {
        type: [StockSchema],
        required: false,
    },
  });


module.exports = WatchListSchema;

