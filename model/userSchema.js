const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
      type: String,
      required: true,
  },
  password: {
      type: String,
      required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;