const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const logger = require("../config/logger");
const Stock = require("../model/stockSchema");

// Stock Endpoint

router.get("/getStock", async (request, response) => {
    const { stockId } = request.query;
  
    if (!stockId) {
      logger.error("Stock ID cannot be null");
      return response.status(400).json({
        message: "Stock ID cannot be null",
        status: 400,
      });
    }
  
    const stockObjId = new mongoose.Types.ObjectId(stockId);
  
    try {
      //Find the stock associated with the given stockID
      logger.info("Attempting to find stock in MongoDB...");
      const stock = await Stock.findById(stockId);
      logger.info(`Found Stock: ${stock}`);
  
      if (!stock) {
        return response.status(404).json({
          message: "Stock not found in the database",
          status: 404,
        });
      }
  
      return response.status(200).json({
        message: "Stock successfully found in the database",
        status: 200,
        stock: stock
      });
    } catch (error) {
      return response.status(500).json({
        message: "Error while searching for stock in MongoDB",
        status: 500,
        error: error.message,
      });
    }
  });

  module.exports = router;