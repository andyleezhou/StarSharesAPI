const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const ArtistSchema = new mongoose.Schema({
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
  bio: {
      type: String,
      required: true,
  },
  stockId: {
    type: ObjectId,
    ref: 'Stock',
    required: false,
  },
  portfolioId: {
    type: ObjectId,
    ref: 'Portfolio',
    required: false,
  },
});

const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;