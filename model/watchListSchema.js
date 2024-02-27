const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const WatchListSchema = new mongoose.Schema({
  userID: {
    type: ObjectId,
    required: true,
  },
  stocks: [
    {
      type: ObjectId,
      required: false,
    },
  ],
});

const WatchList = mongoose.model("WatchList", WatchListSchema);

module.exports = { WatchListSchema, WatchList };
