const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const generateSaltAndHash = (saltRounds, password) => {
    bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    logger.info('Salt: ', salt)
    return bcrypt.hash(password, salt)
  })
  .then(hash => {
    logger.info('Hash: ', hash)
  })
  .catch(err => logger.error(err.message))
}

const hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, 10);
    password = hash;
    return password;
}

const validateUser = (password, user) => {
    return bcrypt.compareSync(password, user.password)     
}

module.exports = {
    validateUser, generateSaltAndHash, hashPassword
}