const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const { hashPassword, validateUser } = require('../util/bcrypt');
const {retrieveUserId, tokenIsValid} = require('../util/jwt')

router.post("/signup", async (request, response) => {
    const { firstName, lastName, email, password } = request.body;

    if (!email || !password || !firstName || !lastName) {
        logger.error("Email, password, firstName, or lastName cannot be null");
        return response.status(400).json({
            message: "Email, password, firstName, or lastName cannot be null",
            status: 400,
        })
    }

    let hashedPassword = hashPassword(password);

    const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName
    });
   
    try {
       logger.info("Attempting to find user in MongoDB...");
       const existingUser = await User.findOne({ email }).exec();
       if (existingUser) {
       logger.error("User already found with those credentials!");
            return response.status(400).json({
                message: "Email is already in use!",
                status: 400,
            })
        }
      logger.info("Attempting to save user to MongoDB")
      await user.save();
      logger.info("User saved")
      return response.status(200).json({ 
          message: "User successfully saved", 
          status: 200, 
          user: user 
        });
    } catch (error) {
      return response.status(500).json({
          message: "User could not be saved in Mongo",
          status: 500,
          error: error
      });
    }
  }
);

router.get("/getUserByEmail", async (request, response) => {
    const { email, password } = request.query;

    if (!email || !password) {
        logger.info("Email or password cannot be null");
        return response.status(400).json({
            message: "Email and password are required",
            status: 400,
        });
    }

    try {
        logger.info("Attempting to find user in MongoDB...");
        const user = await User.findOne({ email });

        if (!user) {
            return response.status(404).json({
                message: "User not found in the database",
                status: 404,
            });
        }

        let token;

        if (validateUser(password, user)) {
            logger.info("User found in database");
            logger.info("generating jwt")
            token = jwt.sign({ userId: user._id }, 'your_secret_key_here', { expiresIn: '1h' });
            logger.info("assigning jwt to user")
        }

        return response.status(200).json({
            message: "User successfully found in the database",
            status: 200,
            user: user,
            token: token, // Include the token in the response
        });
    } catch (error) {
        return response.status(500).json({
            message: "Error while searching for user in MongoDB",
            status: 500,
            error: error.message,
        });
    }
});

router.get("/getUserByToken", async (request, response) => {
    const { userToken } = request.query;

    if (!userToken) {
        logger.info("User Token cannot be null");
        return response.status(400).json({
            message: "User Token is required",
            status: 400,
        });
    }

    const isNotValid = tokenIsValid(userToken);

    if (isNotValid) {
        logger.info("Token not valid")
        return response.status(400).json({
            message: "User Token is not valid",
            status: 400,
        });
    }

    const userId = retrieveUserId(userToken);

    try {
        logger.info("Attempting to find user in MongoDB...");
        const user = await User.findById(userId);

        if (!user) {
            logger.error("User not found in the database")
            return response.status(404).json({
                message: "User not found in the database",
                status: 404,
            });
        }
        else {
            logger.info("User found in database");
        }

        return response.status(200).json({
            message: "User successfully found in the database",
            status: 200,
            user: user
        });
    } catch (error) {
        return response.status(500).json({
            message: "Error while searching for user in MongoDB",
            status: 500,
            error: error.message,
        });
    }
});


module.exports = router;
