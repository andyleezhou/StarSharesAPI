const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Artist = require('../model/artistSchema');
const Stock = require('../model/stockSchema');
const User = require('../model/userSchema');
const Portfolio = require('../model/portfolioSchema');
const { hashPassword, validateUser } = require('../util/bcrypt');

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

    let hashedPassword = hashPassword(password);

    try {
        // create default stock object
        const stock = new Stock({
            artistName: firstName + " " + lastName,
            cost: 100,
            quantity: 10000
        });

        const portfolio = new Portfolio({
            balance: stock.cost * stock.quantity,
            stocks: [stock._id],
            buyingPower: 0,
            quantity: stock.quantity,
            transactions: []
        });

        // create artist object to be saved in DB
        const artist = new Artist({
            firstName,
            lastName,
            email,
            password: hashedPassword, 
            bio,
            stockId: stock._id,
            portfolioId: portfolio._id
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
    const { userId, artistId, stockId, quantity } = request.body; 

    if (!userId || !stockId || !quantity || !artistId) {
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
        let stock = await Stock.findById(stockId);
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

        if (!user.portfolio) {
            logger.info('User portfolio not found... Initializing empty list')
            user.portfolio = [];
        }

        if (!user.portfolio.includes(stock._id)) {
            user.portfolio.push(stock._id); 
        } else {
            logger.info('User already has that stockId in their portfolio')
        }
        
        await user.save();
        logger.info('StockId added into User Portfolio')

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

router.get("/login", async (request, response) => {
    const { email, password } = request.query;

    if (!email || !password) {
        logger.info("Email or password cannot be null");
        return response.status(400).json({
            message: "Email and password are required",
            status: 400,
        });
    }

    try {
        logger.info("Attempting to find Artist in MongoDB...");
        const artist = await Artist.findOne({ email });

        if (!artist) {
            return response.status(404).json({
                message: "Artist not found in the database",
                status: 404,
            });
        }

        let token;

        if (validateUser(password, artist)) {
            logger.info("Artist found in database");
            logger.info("generating jwt")
            token = jwt.sign({ userId: artist._id }, 'your_secret_key_here', { expiresIn: '1h' });
            logger.info("assigning jwt to user")
        }

        return response.status(200).json({
            message: "Artist successfully found in the database",
            status: 200,
            artist: artist,
            token: token, // Include the token in the response
        });
    } catch (error) {
        return response.status(500).json({
            message: "Error while searching for Artist in MongoDB",
            status: 500,
            error: error.message,
        });
    }
});
module.exports = router;
