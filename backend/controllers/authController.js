const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');

// Register a new user
exports.registerUser = async (req, res) => {
  // Destructure username and password. Role is now optional from the request body.
  const { username, password } = req.body;
  let { role } = req.body; // Let role be explicitly passed for admin creation if desired

  // --- THIS IS THE KEY CHANGE ---
  // If 'role' is not provided in the request body (e.g., for public self-registration),
  // assign a default role.
  // You can change 'viewer' to 'manager' if you want new sign-ups to be managers by default.
  if (!role) {
    role = 'viewer'; // Default role for self-registered users
  }
  // --- END KEY CHANGE ---

  // Validate role if provided, to ensure it's one of the allowed enum values
  // This step is optional but good for data integrity if role can be passed.
  const allowedRoles = User.schema.path('role').enumValues;
  if (req.body.role && !allowedRoles.includes(req.body.role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(', ')}` });
  }


  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Basic password validation (can be enhanced with a library like Joi)
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const hashedPassword = await hashPassword(password);

    // Create user with the determined (or defaulted) role
    const user = await User.create({
      username,
      password: hashedPassword,
      role // Use the role variable (either from req.body or defaulted)
    });

    // For self-registration, you might not want to return a token immediately.
    // Often, the user is redirected to the login page.
    // However, returning a token to auto-login is also a common pattern.
    // For now, let's keep it consistent with returning token like login.
    // If you prefer to force login after registration, just send a success message.
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      // Consider if you want to automatically log in by returning a token on register
      // token: generateToken(user._id, user.role),
      message: "User registered successfully. Please login." // Or send token for auto-login
    });
  } catch (error) {
    console.error("Registration error:", error); // Log the full error for debugging
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
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  // req.user is set by the protect middleware
  if (!req.user) { // Should not happen if protect middleware is working
      return res.status(401).json({ message: 'Not authorized, user data not found in request.' });
  }
  res.json({
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role,
  });
};