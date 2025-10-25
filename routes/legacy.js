const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const NewsController = require('../controllers/NewsController');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');

const router = express.Router();

/**
 * Legacy routes for backward compatibility with tests
 * These routes return data in the format expected by the existing tests
 */

// Authentication routes
router.post(
  '/users/signup',
  authRateLimiter,
  AuthController.getRegistrationValidation(),
  async (req, res) => {
    // Custom response wrapper for tests
    const originalJson = res.json;
    res.json = function(data) {
      if (data.success && data.data && data.data.token) {
        return originalJson.call(this, data.data);
      }
      return originalJson.call(this, data);
    };
    return AuthController.register(req, res);
  }
);

router.post(
  '/users/login',
  authRateLimiter,
  AuthController.getLoginValidation(),
  async (req, res) => {
    // Custom response wrapper for tests
    const originalJson = res.json;
    res.json = function(data) {
      if (data.success && data.data && data.data.token) {
        return originalJson.call(this, { token: data.data.token });
      }
      return originalJson.call(this, data);
    };
    return AuthController.login(req, res);
  }
);

// User preferences routes
router.get(
  '/users/preferences',
  authenticate,
  async (req, res) => {
    // Custom response wrapper for tests
    const originalJson = res.json;
    res.json = function(data) {
      if (data.success && data.data && data.data.preferences !== undefined) {
        return originalJson.call(this, { preferences: data.data.preferences });
      }
      return originalJson.call(this, data);
    };
    return UserController.getPreferences(req, res);
  }
);

router.put(
  '/users/preferences',
  authenticate,
  UserController.getPreferencesValidation(),
  UserController.updatePreferences
);

// News routes
router.get(
  '/news',
  authenticate,
  NewsController.getQueryValidation(),
  async (req, res) => {
    // Custom response wrapper for tests
    const originalJson = res.json;
    res.json = function(data) {
      if (data.success && data.data && data.data.news) {
        return originalJson.call(this, { news: data.data.news });
      }
      return originalJson.call(this, data);
    };
    return NewsController.getNews(req, res);
  }
);

module.exports = router;