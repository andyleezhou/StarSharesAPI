const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Transaction = require('../model/transactionSchema');

router.get("/getStockTradeCount", async (request, response) => {
    const { stockId } = req.query;

    if (!stockId) {
        logger.error("StockId cannot be null");
        return response.status(400).json({
            message: "StockId cannot be null",
            status: 400,
        })
    }
    
    try {
        const stockTradeCount = await Transaction.countDocuments({ stockId }).exec();
        return response.status(200).json({ 
            message: "Transaction count successfully fetched from mongo", 
            status: 200, 
            stockTradeCount
          });
    } catch (e) {
        logger.error("Error: ", e);
        return response.status(500).json({
            message: "Transaction could not be found with that stockId",
            status: 500,
            error: error
        });
    }
});


module.exports = router;
