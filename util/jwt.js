const jwt = require('jsonwebtoken');

const retrieveUserId = (token) => {
    const payload = jwt.verify(token, 'your_secret_key_here');
    return payload.userId;
};

const tokenIsNotValid = (token) => {
    try {
        const expiration = jwt.verify(token, "your_secret_key_here").exp;
        const currentTime = Date.now() / 1000; // Current time in seconds
        return expiration <= currentTime; // Return false if token is still valid
    } catch (error) {
        // Token expired, return true
       return true;
    }
};

module.exports = {
    retrieveUserId, tokenIsNotValid
}