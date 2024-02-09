const express = require("express");
const User = require("../model/userSchema");
const router = express.Router();

router.post("/signup", async (request, response) => {
    const { name, email, password } = request.body;

    if (!email || !password || !name) {
        return response.status(400).json({
            message: "Email or password can be null",
            status: 400,
        })
    }

    const user = new User(request.body);
   
    try {
      console.log("Attempting to save user to MongoDB")
      await user.save();
      console.log("User saved")
      response.status(200).json({ 
          message: "User successfully saved", 
          status: 200, 
          user: user 
        });
    } catch (error) {
      response.status(500).json({
          message: "User could not be saved in Mongo",
          status: 500,
          error: error
      });
    }
  }
);

router.get("/getUserByEmail", async (request, response) => {
    const { email } = request.query;

    if (!email) {
        return response.status(400).json({
            message: "Email cannot be null",
            status: 400,
        });
    }

    try {
        console.log("Attempting to find user in MongoDB...");
        const users = await User.find({ email }).exec();

        if (users.length === 0) {
            return response.status(404).json({
                message: "User not found in the database",
                status: 404,
            });
        }
        
        const foundUser = users[0]; 
        console.log("User found in database")

        response.status(200).json({
            message: "User successfully found in the database",
            status: 200,
            user: foundUser,
        });
    } catch (error) {
        response.status(500).json({
            message: "Error while searching for user in MongoDB",
            status: 500,
            error: error.message,
        });
    }
});

module.exports = router;