const mongoose = require("mongoose");
const { PortfolioSchema } = require('./subSchema');

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
    type: PortfolioSchema,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;