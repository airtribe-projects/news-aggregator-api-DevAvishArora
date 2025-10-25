const AuthService = require('../services/AuthService');
const dataStore = require('../models/DataStore');
const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json(createErrorResponse(
        'Authentication required',
        'No token provided'
      ));
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);

    // Check if user still exists
    const user = dataStore.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json(createErrorResponse(
        'Authentication failed',
        'User not found'
      ));
    }

    // Add user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json(createErrorResponse(
      'Authentication failed',
      error.message
    ));
  }
};

/**
 * Optional authentication middleware
 * Similar to authenticate but doesn't fail if no token is provided
 */
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = AuthService.verifyToken(token);
      const user = dataStore.getUserById(decoded.userId);
      if (user) {
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};