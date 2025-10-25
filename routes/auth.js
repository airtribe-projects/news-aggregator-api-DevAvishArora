const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authRateLimiter } = require('../middleware/security');

const router = express.Router();

/**
 * Authentication Routes
 */

/**
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  authRateLimiter,
  AuthController.getRegistrationValidation(),
  AuthController.register
);

/**
 * @route   POST /users/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post(
  '/login',
  authRateLimiter,
  AuthController.getLoginValidation(),
  AuthController.login
);

module.exports = router;