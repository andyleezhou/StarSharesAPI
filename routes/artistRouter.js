const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Artist = require('../model/artistSchema');

router.post("/signup", async (request, response) => {
    const { firstName, lastName, email, password, bio } = request.body; 

    if (!email || !password || !firstName || !lastName || !bio) {
        logger.error("Email, password, firstName, lastName, or bio cannot be null");
        return response.status(400).json({
            message: "Email, password, firstName, lastName, or bio cannot be null",
            status: 400,
        })
    }

    try {
        const stock = {
            artistName: firstName + " " + lastName,
            cost: 100,
            quantity: 10000
        };

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

module.exports = router;
