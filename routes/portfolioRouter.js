const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const Portfolio = require("../model/portfolioSchema");

router.get("/getPortfolio", async (request, response) => {
    const { portfolioId } = request.query;
  
    if (!portfolioId) {
      logger.error("portfolioId cannot be null");
      return response.status(400).json({
        message: "portfolioId cannot be null",
        status: 400,
      });
    }
    
    try {
      //Find the portfolio associated with the given portfolioId
      logger.info("Attempting to find stock in MongoDB...");
      const portfolio = await Portfolio.findById(portfolioId);
      logger.info(`Found Portfolio: ${portfolio}`);
  
      if (!portfolio) {
        return response.status(404).json({
          message: "Portfolio not found in the database",
          status: 404,
        });
      }
  
      return response.status(200).json({
        message: "Portfolio successfully found in the database",
        status: 200,
        portfolio: portfolio
      });
    } catch (error) {
      return response.status(500).json({
        message: "Error while searching for Portfolio in MongoDB",
        status: 500,
        error: error.message,
      });
    }
  });

  const getBalanceFromPortfolio = (portfolio) => {
      if (!portfolio) {
          logger.error("Portfolio cannot be null");
          return null;
      }
      return portfolio.balance;
  }

  module.exports = router;