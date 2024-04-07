const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.post('/notifications', (request, response) => {
    // Parse the request body
    const { title, message, userId } = request.body;

    if (!title || !message || !userId) {
        logger.error("Title, message, or userId cannot be null");
        return response.status(400).json({
          message: "Title, message, or userId cannot be null",
          status: 400,
        });
    }
   
   // Send the notification to the user
    sendNotification(userId, title, message);
   return response.status(200).json({
       status: 200,
       message: 'Notification sent successfully',
       userId
    });
});

const sendNotification = (userId, title, message) => {
    // Implement new notification logic with 3rd party service here
    // console logs are a place holder
    console.log(`Sending notification to user ${userId}`);
    console.log(`Title: ${title}`);
    console.log(`Message: ${message}`);
}
module.exports = router;
   