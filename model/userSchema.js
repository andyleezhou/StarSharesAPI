const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
      type: String,
      required: false,
  },
  password: {
      type: String,
      required: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;