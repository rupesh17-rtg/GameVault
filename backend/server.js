require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Game = require('./models/Game');
const authMiddleware = require('./middleware/auth');
// Trigger comment 2
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Middleware - Fixed localhost:5000 to localhost:3000 to match frontend
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json());

// Auth Routes

// 1. POST /api/auth/register - Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword
    });

    // Sign JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// 2. POST /api/auth/login - Log in an existing user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Games Routes (Protected with authMiddleware)

// 3. GET /api/games - Fetch all games for authenticated user
app.get('/api/games', authMiddleware, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch games' });
  }
});

// 4. POST /api/games - Add a new game for authenticated user
app.post('/api/games', authMiddleware, async (req, res) => {
  try {
    const { title, platform, completed } = req.body;
    if (!title || !platform) {
      return res.status(400).json({ error: 'Title and Platform are required' });
    }
    const game = await Game.create({
      title,
      platform,
      completed,
      userId: req.userId
    });
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create game' });
  }
});

// 5. PUT /api/games/:id - Update an existing game owned by authenticated user
app.put('/api/games/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, platform, completed } = req.body;
    
    const game = await Game.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, platform, completed },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ error: 'Game not found or unauthorized' });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update game' });
  }
});

// 6. DELETE /api/games/:id - Delete a game owned by authenticated user
app.delete('/api/games/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findOneAndDelete({ _id: id, userId: req.userId });
    if (!game) {
      return res.status(404).json({ error: 'Game not found or unauthorized' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to delete game' });
  }
});

// Error handling fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});