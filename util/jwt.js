const jwt = require('jsonwebtoken');

const retrieveUserId = (token) => {
    const payload = jwt.verify(token, 'your_secret_key_here');
    return payload.userId;
};

const tokenIsValid = (token) => {
    const expiration = (jwt.verify(token, "your_secret_key_here")).exp;
    const currentTime = Date.now() / 1000; // Current time in seconds
    return expiration < currentTime;
};

module.exports = {
    retrieveUserId, tokenIsValid
}