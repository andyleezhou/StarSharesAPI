const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

router.get("/getBalance", async (request, response) => {
    const { userId } = request.query;

  if (!userId) {
    logger.error("User ID cannot be null");
    return response.status(401).json({
      message: "User ID cannot be null",
      status: 401,
    });
  }

  const userObjId = new mongoose.Types.ObjectId(userId);

  try {
    //Find the watchlist associated with the given userID
    logger.info("Attempting to find User in MongoDB...");
    const user = await User.findOne({ userId: userObjId });
    logger.info(`Found user: ${user}`);

    if (!user) {
      return response.status(404).json({
        message: "User not found in the database",
        status: 404,
      });
    }

    const balance = user.balance;

    return response.status(200).json({
      message: "User successfully found in the database",
      status: 200,
      balance: balance,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Error while searching for User in MongoDB",
      status: 500,
      error: error.message,
    });
  }
});