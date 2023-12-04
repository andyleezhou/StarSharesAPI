const express = require("express");
const User = require("../model/userSchema");
const router = express.Router();

router.post("/user", async (request, response) => {
    const user = new User(request.body);
   
    try {
      await user.save();
      response.status(200).json({ 
          message: "User successfully saved", 
          status: 200, 
          user: user 
        });
    } catch (error) {
      response.status(500).send(error);
    }
  });
   
module.exports = router;