const express = require('express');

/**
 * Main API router
 * Combines all route modules
 */
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const newsRoutes = require('./news');

// Mount routes
router.use('/users', authRoutes);
router.use('/users', userRoutes);
router.use('/news', newsRoutes);

// API information endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'News Aggregator API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/users/signup': 'Register a new user',
        'POST /api/users/login': 'Login user and get JWT token',
      },
      users: {
        'GET /api/users/preferences': 'Get user preferences',
        'PUT /api/users/preferences': 'Update user preferences',
        'GET /api/users/profile': 'Get user profile with statistics',
        'GET /api/users/read-articles': 'Get user read articles',
        'GET /api/users/favorite-articles': 'Get user favorite articles',
      },
      news: {
        'GET /api/news': 'Get personalized news',
        'GET /api/news/search/:keyword': 'Search news articles',
        'GET /api/news/read': 'Get read articles',
        'GET /api/news/favorites': 'Get favorite articles',
        'GET /api/news/:id': 'Get specific article',
        'POST /api/news/:id/read': 'Mark article as read',
        'POST /api/news/:id/favorite': 'Mark article as favorite',
        'DELETE /api/news/:id/favorite': 'Remove article from favorites',
      },
    },
    documentation: 'See README.md for detailed API documentation',
  });
});

module.exports = router;