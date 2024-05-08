const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const Portfolio = require("../model/portfolioSchema");
const mongoose = require('mongoose');
const User = require('../model/userSchema');
const Stock = require('../model/stockSchema'); 

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


router.post('/createPortfolio', async (request, response) => {
    const { userId } = request.body;

    if (!userId) {
        logger.error('User ID cannot be null');
        return response.status(400).json({
            message: 'User ID cannot be null',
            status: 400,
        });
    }

    try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (portfolio) {
            logger.error('Portfolio already exists');
            return response.status(409).json({
                message: 'Portfolio already exists',
                status: 409,
            });
        }

        portfolio = new Portfolio(request.body);

        logger.info('Attempting to save new Portfolio to MongoDB');
        await portfolio.save();
        logger.info('Portfolio saved');
        return response.status(201).json({
            message: 'Portfolio successfully created',
            status: 201,
            portfolio: portfolio,
        });
    } catch (error) {
        return response.status(500).json({
            message: 'Failed to create a new portfolio',
            status: 500,
            error: error.message,
        });
    }
});

router.post('/deletePortfolio', async (request, response) => {
    const { userId } = request.body;

    if (!userId) {
        logger.error('User ID cannot be null');
        return response.status(400).json({
            message: 'User ID cannot be null',
            status: 400,
        });
    }

    try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (!portfolio) {
            logger.error('Portfolio does not exist');
            return response.status(404).json({
                message: 'Portfolio does not exist',
                status: 404,
            });
        }

        logger.info('Attempting to delete Portfolio from MongoDB');
        await Portfolio.deleteOne({ userId: userObjId }).exec();
        logger.info('Portfolio deleted');
        return response.status(200).json({
            message: 'Portfolio successfully deleted',
            status: 200,
        });
    } catch (error) {
        return response.status(500).json({
            message: 'Failed to delete the portfolio',
            status: 500,
            error: error.message,
        });
    }
});

router.get('/getPortfolioByUserId', async (request, response) => {
    const { userId } = request.query;

    if (!userId) {
        logger.info('User ID cannot be null');
        return response.status(400).json({
            message: 'User ID is required',
            status: 400,
        });
    }

    try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (!portfolio) {
            logger.error('Portfolio not found');
            return response.status(404).json({
                message: 'Portfolio not found',
                status: 404,
            });
        }

        return response.status(200).json({
            message: 'Portfolio found',
            status: 200,
            portfolio: portfolio,
        });
    } catch (error) {
        return response.status(500).json({
            message: 'Failed to get portfolio',
            status: 500,
            error: error.message,
        });
    }
});

router.get('/getOwnedStocks', async (request, response) => {
    const { userId } = request.query;

    if (!userId) {
        logger.error('User ID cannot be null');
        return response.status(400).json({
            message: 'User ID cannot be null',
            status: 400,
        });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            logger.error('Invalid user ID');
            return response.status(400).json({
                message: 'Invalid user ID',
                status: 400,
                userId: userId,
            });
        }

        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (!portfolio) {
            logger.error('Portfolio not found');
            return response.status(404).json({
                message: 'Portfolio not found',
                status: 404,
            });
        }

        const ownedStocks = [];
        for (const stockId of portfolio.stocks) {
            const stock = await Stock.findById(stockId).exec();
            if (stock) {
                ownedStocks.push(stock);
            }
        }

        return response.status(200).json({
            message: 'Owned stocks found',
            status: 200,
            stocks: ownedStocks,
        });
    } catch (error) {
        console.error('Error while fetching owned stocks:', error);
        return response.status(500).json({
            message: 'Failed to get owned stocks',
            status: 500,
            error: error.message,
        });
    }
    
});

router.post('/addTransactionToPortfolio', async (request, response) => {
    const { userId, stockId, transactionType, quantity } = request.body;
    let portfoliostock = null;
    let netQuantity = 0; // Initialize netQuantity

    if (!userId || !stockId || !transactionType) {
        logger.error('Invalid request parameters');
        return response.status(400).json({
            message: 'Invalid request parameters',
            status: 400
        });
    }

    try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (!portfolio) {
            logger.error('Portfolio not found');
            return response.status(404).json({
                message: 'Portfolio not found',
                status: 404
            });
        }

        // Convert stockId to ObjectId
        const stockObjId = new mongoose.Types.ObjectId(stockId);

        // Fetch the stock information from the database based on the provided stockId
        const stock = await Stock.findById(stockObjId).exec();
        if (!stock) {
            logger.error('Stock not found');
            return response.status(404).json({
                message: 'Stock not found',
                status: 404
            });
        }

        // Calculate the transaction cost based on the fetched stock's cost
        const transactionCost = quantity * stock.cost;

        // Check if the user has enough buying power for a buy transaction
        if (transactionType === 'buy' && portfolio.buyingPower < transactionCost) {
            logger.error('Insufficient buying power');
            return response.status(400).json({
                message: 'Insufficient buying power',
                status: 400
            });
        }

        // If the transaction is a buy, check if there are enough stocks available
        if (transactionType === 'buy' && quantity > stock.quantity) {
            logger.error('Insufficient stocks available');
            return response.status(400).json({
                message: 'Insufficient stocks available',
                status: 400
            });
        }

        // Find the stock in the portfolio
        portfoliostock = portfolio.stocks.find(stock => String(stock.stockId) === stockId);

        // If the transaction is a sell, check if the user has enough stock to sell
        if (transactionType === 'sell' && portfoliostock.quantity < quantity) {
            logger.error('Insufficient stock to sell');
            return response.status(400).json({
                message: 'Insufficient stock to sell',
                status: 400
            });
        }

        // Deduct the transaction cost from the buying power for a buy transaction
        if (transactionType === 'buy') {
            portfolio.buyingPower -= transactionCost;
            stock.quantity -= quantity;
        }

        if (transactionType === 'sell') {
            portfolio.buyingPower += transactionCost;
            stock.quantity += quantity;
        }

        if (transactionType === "sell" && portfoliostock.stocks.quantity === 0) {
            // If the user sells all of their stock, remove the stock from the portfolio
            portfolio.stocks.pull(portfoliostock._id);
        }

        const transaction = {
            stockId: stockId,
            transactionType: transactionType,
            quantity: quantity,
            price: stock.cost // Use the fetched stock's cost as the price
        };
        // update the portfolio stock in the databse
        portfolio.transactions.push(transaction);

        logger.info('Attempting to save Stock to MongoDB')
        await stock.save();
        logger.info('Attempting to save Portfolio to MongoDB');
        await portfolio.save();
        logger.info('Transaction added to Portfolio');
        return response.status(200).json({
            message: 'Transaction added to Portfolio',
            status: 200,
            portfolio: portfolio
        });
    } catch (error) {
        return response.status(500).json({
            message: 'Failed to add transaction to Portfolio',
            status: 500,
            error: error.message
        });
    }
});


router.delete('/removeStockFromPortfolio', async (request, response) => {
    const { userId, stockId } = request.body;

    if (!userId || !stockId) {
        logger.error('User ID and Stock ID cannot be null');
        return response.status(400).json({
            message: 'User ID and Stock ID cannot be null',
            status: 400,
        });
    }

    try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (!portfolio) {
            logger.error('Portfolio not found');
            return response.status(404).json({
                message: 'Portfolio not found',
                status: 404,
            });
        }

        const stockObjId = new mongoose.Types.ObjectId(stockId);
        portfolio.stocks.pull(stockObjId);

        logger.info('Attempting to save Portfolio to MongoDB');
        await portfolio.save();
        logger.info('Stock removed from Portfolio');
        return response.status(200).json({
            message: 'Stock removed from Portfolio',
            status: 200,
            portfolio: portfolio,
        });
    } catch (error) {
        return response.status(500).json({
            message: 'Failed to remove stock from Portfolio',
            status: 500,
            error: error.message,
        });
    }
});

router.post('/addStockToPortfolio', async (request, response) => {
    const { userId, stockId, quantity } = request.body;

    if (!userId || !stockId) {
        logger.error('User ID and Stock ID cannot be null');
        return response.status(400).json({
            message: 'User ID and Stock ID cannot be null',
            status: 400,
        });
    }

    try {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let portfolio = await Portfolio.findOne({ userId: userObjId }).exec();
        if (!portfolio) {
            logger.error('Portfolio not found');
            return response.status(404).json({
                message: 'Portfolio not found',
                status: 404,
            });
        }

        // Check if the stock already exists in the portfolio
        const existingStock = portfolio.stocks.find(stock => String(stock.stockId) === stockId); // linear search
        if (existingStock) {
            logger.error('Stock already exists in Portfolio');
            return response.status(400).json({
                message: 'Stock already exists in Portfolio',
                status: 400,
            });
        }

        const stockObjId = new mongoose.Types.ObjectId(stockId);
        portfolio.stocks.push({stockId: stockObjId, quantity: quantity});

        logger.info('Attempting to save Portfolio to MongoDB');
        await portfolio.save();
        logger.info('Stock added to Portfolio');
        return response.status(200).json({
            message: 'Stock added to Portfolio',
            status: 200,
            portfolio: portfolio,
        });
    } catch (error) {
        return response.status(500).json({
            message: 'Failed to add stock to Portfolio',
            status: 500,
            error: error.message,
        });
    }
});

module.exports = router;