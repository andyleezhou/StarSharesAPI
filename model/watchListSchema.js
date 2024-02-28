const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const WatchListSchema = new mongoose.Schema({
  userID: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  stocks: [
    {
      type: ObjectId,
      ref: 'Stock',
      required: false,
    },
  ],
});

const WatchList = mongoose.model("WatchList", WatchListSchema);

module.exports = WatchList;
