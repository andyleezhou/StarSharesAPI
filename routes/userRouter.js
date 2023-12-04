const express = require("express");
const User = require("../model/userSchema");
const router = express.Router();

router.post("/user", async (request, response) => {
    if (request.body == null) {
        return response.status(400).json({
            message: "Request cannot be null",
            status: 400,
        })
    }
    const user = new User(request.body);
   
    try {
      console.log("Attempting to save user to MongoDB")
      await user.save();
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
  });
   
module.exports = router;