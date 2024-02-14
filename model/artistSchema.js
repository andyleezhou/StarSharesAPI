const mongoose = require("mongoose");
const Stock = require('./stockSchema');

const ArtistSchema = new mongoose.Schema({
  artistName: {
    type: String,
    required: true,
  },
  bio: {
      type: String,
      required: true,
  },
  stock: {
      type: Stock,
      required: true,
  },
});

const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;