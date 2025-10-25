const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * User Routes (all require authentication)
 */

/**
 * @route   GET /users/preferences
 * @desc    Get user's news preferences
 * @access  Private
 */
router.get(
  '/preferences',
  authenticate,
  UserController.getPreferences
);

/**
 * @route   PUT /users/preferences
 * @desc    Update user's news preferences
 * @access  Private
 */
router.put(
  '/preferences',
  authenticate,
  UserController.getPreferencesValidation(),
  UserController.updatePreferences
);

/**
 * @route   GET /users/profile
 * @desc    Get user profile with statistics
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  UserController.getProfile
);

/**
 * @route   GET /users/read-articles
 * @desc    Get user's read articles
 * @access  Private
 */
router.get(
  '/read-articles',
  authenticate,
  UserController.getReadArticles
);

/**
 * @route   GET /users/favorite-articles
 * @desc    Get user's favorite articles
 * @access  Private
 */
router.get(
  '/favorite-articles',
  authenticate,
  UserController.getFavoriteArticles
);

/**
 * @route   DELETE /users/account
 * @desc    Delete user account (bonus feature)
 * @access  Private
 */
router.delete(
  '/account',
  authenticate,
  UserController.deleteAccount
);

module.exports = router;