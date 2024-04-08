const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
      type: String,
      required: true,
  },
  password: {
      type: String,
      required: true,
  },
  portfolio: {
    type: ObjectId,
    ref: 'Portfolio',
    required: false,
  },
  recentlyViewed: {
    type: Array,
    ref: 'Watchlist',
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;