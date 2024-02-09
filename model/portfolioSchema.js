const mongoose = require("mongoose");
const Stock = require("./stockSchema");

const PortfolioSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  stocks: {
      type: [Stock],
      required: true,
  },
  buyingPower: {
      type: Number,
      required: true,
  },
  quantity: {
      type: Number,
      required: true,
  },
  transactions: {
      type: Number,
      required: true,
  },
});

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

module.exports = Portfolio;