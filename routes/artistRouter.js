const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Artist = require('../model/artistSchema');
const { Stock } = require('../model/transactionSchema');
const User = require('../model/userSchema');

router.post("/signup", async (request, response) => {
    // take in signup params
    const { firstName, lastName, email, password, bio } = request.body; 

    // Guard clauses
    if (!email || !password || !firstName || !lastName || !bio) {
        logger.error("Email, password, firstName, lastName, or bio cannot be null");
        return response.status(400).json({
            message: "Email, password, firstName, lastName, or bio cannot be null",
            status: 400,
        })
    }

    try {
        // create default stock object
        const stock = {
            artistName: firstName + " " + lastName,
            cost: 100,
            quantity: 10000
        };
        // create artist object to be saved in DB
        const artist = new Artist({
            firstName,
            lastName,
            email,
            password, 
            bio,
            stock: stock
        });

        logger.info("Attempting to save artist to MongoDB");
        await artist.save();
        logger.info("Artist saved");

        return response.status(200).json({ 
            message: "Artist successfully signed up", 
            status: 200, 
            artist: artist
        });
    } catch (error) {
        return response.status(500).json({
            message: "Artist could not be signed up in Mongo",
            status: 500,
            error: error.message
        });
    }
});

/// Trading Stock Endpoint
router.post("/trade", async (request, response) => {
    const { userId, artistId, artistName, quantity } = request.body; 

    if (!userId || !artistName || !quantity || !artistId) {
        logger.error("User ID, stock ID, artist ID,  or quantity cannot be null");
        return response.status(400).json({
            message: "User ID, stock ID, artist ID,  or quantity cannot be null",
            status: 400,
        })
    }

    try {
        // Find the user
        let user = await User.findById(userId);
        if (!user) {
            logger.error("User not found");
            return response.status(404).json({
                message: "User not found",
                status: 404,
            });
        }

        let artist = await Artist.findById(artistId);
        if (!artist) {
            logger.error("Artist not found");
            return response.status(404).json({
                message: "Artist not found",
                status: 404,
            });
        }

        // Find the stock
        let stock = await Stock.findOne({ artistName: artist.firstName + " " + artist.lastName });
        if (!stock) {
            // Create new stock if not exists
            stock = new Stock({
                artistName: artist.firstName + " " + artist.lastName,
                cost: 100, // Set default cost
                quantity: 10000, // Initialize quantity
            });
            await stock.save();
        }

        // Update quantity
        stock.quantity += quantity;
        await stock.save();

        // Update user's stocks
        if (!user.stocks) {
            user.stocks = [];
        }
        user.stocks.push(stock); // Assuming User schema has a field 'stocks' to store the user's stocks
        await user.save();

        logger.info(`Stock bought by user ${user.username}`);
        return response.status(200).json({ 
            message: "Stock bought successfully", 
            status: 200, 
            stock
        });
    } catch (error) {
        return response.status(500).json({
            message: "Failed to buy stock",
            status: 500,
            error: error.message
        });
    }
});
module.exports = router;
