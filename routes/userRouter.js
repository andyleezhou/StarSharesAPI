const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');

router.post("/signup", async (request, response) => {
    const { firstName, lastName, email, password } = request.body;

    if (!email || !password || !firstName || !lastName) {
        logger.error("Email, password, firstName, or lastName cannot be null");
        return response.status(400).json({
            message: "Email, password, firstName, or lastName cannot be null",
            status: 400,
        })
    }

    const user = new User(request.body);
   
    try {
       logger.info("Attempting to find user in MongoDB...");
       const existingUser = await User.findOne({ email }).exec(); // need to change this to find one user with email, if user has a different password, they still are added to the database
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
    const { email, password } = request.query; // req email

    if (!email || !password) {
        logger.info("Email or password cannot be null");
        return response.status(400).json({
            message: "Email and password are required",
            status: 400,
        });
    }// make sure password ret true and email is not in db

    try {
        logger.info("Attempting to find user in MongoDB...");
        const user = await User.findOne({ email }).exec();
        logger.info(`Found User: ${user}`);

        if (!user) {
            return response.status(404).json({
                message: "User not found in the database",
                status: 404,
            });
        }

        logger.info("User found in database");
        // check if user pw matches

        if ( await bcrypt.compareSync(password, user.password)) {
            logger.info("Password is correct");
        } else {
            logger.info("Password is incorrect");
            return response.status(400).json({
                message: "Password is incorrect",
                status: 400,
            });
        }

        // Generate a token
        logger.info("generating jwt")
        const token = jwt.sign({ userId: user._id }, 'your_secret_key_here', { expiresIn: '1h' });
        logger.info("assigning jwt to user")

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


module.exports = router;
