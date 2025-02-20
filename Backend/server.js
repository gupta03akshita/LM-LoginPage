const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Import DB config and User model
const connectDB = require('./db/config');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
connectDB();

// Session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // Session TTL (1 day)
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ['profile', 'email']
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// JWT utility functions
function generateJWT(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      googleId: user.googleId
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Authentication middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Database error' });
    }
  });
}

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    const token = generateJWT(req.user);
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

// Protected routes
app.get('/api/user', authenticateJWT, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture
  });
});

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});