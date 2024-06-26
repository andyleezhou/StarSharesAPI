const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const logger = require("../config/logger");
const WatchList = require("../model/watchListSchema");

/// Watchlist Stock Endpoint

router.post("/createWatchlist", async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    logger.error("User ID cannot be null");
    return response.status(400).json({
      message: "User ID cannot be null",
      status: 400,
    });
  }

  // Check if watchlist already exists for the user
  try {
    const userObjId = new mongoose.Types.ObjectId(userId);
    let watchlist = await WatchList.findOne({ userId: userObjId }).exec();
    if (watchlist) {
      logger.error("Watchlist already exists");
      return response.status(409).json({
        message: "Watchlist already exists",
        status: 409,
      });
    }

    // Create a new watchlist for the user
    watchlist = new WatchList(request.body);

    logger.info("Attempting to save new Watchlist to MongoDB");
    await watchlist.save();
    logger.info("Watchlist saved");
    return response.status(201).json({
      message: "Watchlist successfully created",
      status: 201,
      watchlist: watchlist,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to create a new watchlist",
      status: 500,
      error: error.message,
    });
  }
});

router.post("/deleteWatchlist", async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    logger.error("User ID cannot be null");
    return response.status(400).json({
      message: "User ID cannot be null",
      status: 400,
    });
  }

  const userObjId = new mongoose.Types.ObjectId(userId);

  try {
    // Find the watchlist by userId
    logger.info("Attempting to find watchlist to delete");
    let watchlist = await WatchList.findOne({ userId: userObjId });
    if (!watchlist) {
      logger.error("Watchlist not found");
      return response.status(404).json({
        message: "Wathclist not found",
        status: 404,
      });
    }

    // Delete watchlist
    logger.info("Found watchlist to be deleted");
    await WatchList.deleteOne({ userId: userObjId });
    logger.info("Watchlist successfully deleted");
    return response.status(200).json({
      message: "Watchlist successfully deleted",
      status: 200,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Falied to delete watchlist",
      status: 500,
      error: error.message,
    });
  }
});

router.post("/addToWatchlist", async (request, response) => {
  const { userId, stockId } = request.body;

  if (!userId || !stockId) {
    logger.error("User ID or stockId cannot be null");
    return response.status(401).json({
      message: "User ID or stockId cannot be null",
      status: 401,
    });
  }

  const userObjId = new mongoose.Types.ObjectId(userId);
  const stockObjId = new mongoose.Types.ObjectId(stockId);

  try {
    // Find the watchlist by userId
    let watchlist = await WatchList.findOne({ userId: userObjId });
    if (!watchlist) {
      logger.error("Watchlist not found");
      return response.status(404).json({
        message: "Wathclist not found",
        status: 404,
      });
    }

    // Add new stock to watchlist
    if (watchlist.stocks.includes(stockObjId)) {
      logger.info("Stock is already added to watchlist");
    } else {
      watchlist.stocks.push(stockObjId);
      await watchlist.save();
      logger.info("Stock successfully added to watchlist");
      return response.status(200).json({
        message: "Stock successfully added to watchlist",
        status: 200,
        stockId,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: "Failed to add stock to watchlist",
      status: 500,
      error: error.message,
    });
  }
});

router.get("/getWatchlist", async (request, response) => {
  const { userId } = request.query;

  if (!userId) {
    logger.error("User ID cannot be null");
    return response.status(400).json({
      message: "User ID cannot be null",
      status: 400,
    });
  }

  const userObjId = new mongoose.Types.ObjectId(userId);

  try {
    //Find the watchlist associated with the given userID
    logger.info("Attempting to watchlist in MongoDB...");
    const watchlist = await WatchList.findOne({ userId: userObjId });
    logger.info(`Found Watchlist: ${watchlist}`);

    if (!watchlist) {
      return response.status(404).json({
        message: "Watchlist not found in the database",
        status: 404,
      });
    }

    return response.status(200).json({
      message: "Watchlist successfully found in the database",
      status: 200,
      watchlist: watchlist,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Error while searching for watchlist in MongoDB",
      status: 500,
      error: error.message,
    });
  }
});

router.post("/deleteFromWatchlist", async (request, response) => {
  const { userId, stockId } = request.body;
  
  if (!userId || !stockId) {
    logger.error("User ID or stockId cannot be null");
    return response.status(401).json({
      message: "User ID or stockId cannot be null",
      status: 401,
    });
  }

  const userObjId = new mongoose.Types.ObjectId(userId);
  const stockObjId = new mongoose.Types.ObjectId(stockId);

  try {
    // Find the watchlist by userId
    let watchlist = await WatchList.findOne({ userId: userObjId });
    if (!watchlist) {
      logger.error("Watchlist not found");
      return response.status(404).json({
        message: "Wathclist not found",
        status: 404,
      });
    }

    // Delete stock from watchlist
    if (!watchlist.stocks.includes(stockObjId)) {
      logger.info("No such stock found inside watchlist to be deleted");
    } else {
      watchlist.stocks = watchlist.stocks.filter(
        (stock) => !stock.equals(stockObjId)
      );
      await watchlist.save();
      logger.info("Stock successfully deleted from watchlist");
      return response.status(200).json({
        message: "Stock successfully deleted from watchlist",
        status: 200,
        stockId,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: "Failed to add stock to watchlist",
      status: 500,
      error: error.message,
    });
  }
});

module.exports = router;
