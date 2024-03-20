const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const retrieveUserId = (token) => {
    const payload = jwt.verify(token, 'your_secret_key_here');
    return payload.userId;
}

module.exports = {
    retrieveUserId
}