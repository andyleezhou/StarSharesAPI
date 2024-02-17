const mongoose = require("mongoose");
const { PortfolioSchema, StockSchema } = require('./subSchema');

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
  stock: {
    type: StockSchema,
    required: false,
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: false,
  },
  portfolio: {
    type: PortfolioSchema,
    required: false,
  },
});

const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;