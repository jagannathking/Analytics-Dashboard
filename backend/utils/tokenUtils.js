const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()


exports.generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};