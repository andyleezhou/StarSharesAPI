const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

let clients = [];

// Endpoint for SSE
router.get('/events', (request, response) => {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    // Send initial data to keep the connection open
    response.write('retry: 10000\n\n');

    clients.push(response);

    // Remove client when connection is closed
    request.on('close', () => {
        clients = clients.filter(client => client !== response);
    });
});

// Endpoint to send notifications
router.post('/notifications', (request, response) => {
    const { title, message } = request.body;

    if (!title || !message) {
        logger.error("Title, message cannot be null");
        return response.status(400).json({
            message: "Title, message cannot be null",
            status: 400,
        });
    }

    // Send the notification to the user
    sendNotification(title, message);

    return response.status(200).json({
        status: 200,
        message: 'Notification sent successfully',
        userId,
    });
});

const sendNotification = (title, message) => {
    const notification = JSON.stringify({ title, message });

    // Send notification to all connected clients
    clients.forEach(client => {
        client.write(`data: ${notification}\n\n`);
    });

    console.log(`Title: ${title}`);
    console.log(`Message: ${message}`);
};

module.exports = router;
   