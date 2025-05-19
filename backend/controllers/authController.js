const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');


// Register a new user (e.g., by an admin)
exports.registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ username, password: hashedPassword, role });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }

};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await comparePassword(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });

        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    // req.user is set by the protect middleware
    res.json({
        _id: req.user._id,
        username: req.user.username,
        role: req.user.role,
    });
};