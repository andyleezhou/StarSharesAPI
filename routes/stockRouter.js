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
      const stock = await Stock.findById(stockObjId);
      logger.info(`Found Stock`);
  
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

  router.get("/getStockByName", async (request, response) => {
    const { artistName } = request.query;
    if (!artistName) {
      logger.error("Artist name cannot be null");
      return response.status(401).json({
        message: "Artist name cannot be null",
        status: 401,
      });
    }
  
    //const stockObjId = new mongoose.Types.ObjectId(stockId);
  
    try {
      //Find the stock associated with the given stockID
      logger.info("Attempting to find stock in MongoDB...");
      const stock = await Stock.findOne({artistName});
      logger.info(`Found Stock`);
  
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

  router.post("/addStock", async (request, response) => {
    const { artistName, artistImage, spotifyId } = request.body;
    if (!artistName || !artistImage || !spotifyId) {
        logger.error("Artist Name, Artist Image, or Spotify ID cannot be null");
        return response.status(401).json({
            message: "Artist Name, Artist Image, or Spotify ID cannot be null",
            status: 401,
        })
    }

    const stock = new Stock({
        artistName: artistName,
        artistImage: artistImage,
        spotifyId: spotifyId,
        cost: 100
    });
   
    try {
       logger.info("Attempting to find stock in MongoDB...");
       const existingStock = await Stock.findOne({ spotifyId }).exec();
       if (existingStock) {
       logger.error("Stock already found with that artist name!");
            return response.status(400).json({
                message: "Stock already in database!",
                stock: existingStock,
                status: 400,
            })
        }
      logger.info("Attempting to save artist stock to MongoDB")
      await stock.save();
      logger.info("Artist stock saved")
      return response.status(200).json({ 
          message: "Artist stock successfully saved", 
          status: 200, 
          stock: stock,
        });
    } catch (error) {
      return response.status(500).json({
          message: "Artist stock could not be saved in MongoDB",
          status: 500,
          error: error
      });
    }
  }
);

  module.exports = router;