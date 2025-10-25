const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Authentication service for handling user registration, login, and token management
 */
class AuthService {
  /**
   * Hash a password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} - True if passwords match
   */
  static async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate a JWT token for a user
   * @param {Object} payload - User data to include in token
   * @returns {string} - JWT token
   */
  static generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'news-aggregator-api',
      audience: 'news-aggregator-client',
    });
  }

  /**
   * Verify and decode a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} - Decoded token payload
   * @throws {Error} - If token is invalid or expired
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret, {
        issuer: 'news-aggregator-api',
        audience: 'news-aggregator-client',
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else if (error.name === 'NotBeforeError') {
        throw new Error('Token not active');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} - Extracted token or null
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  static validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Generate a refresh token (for future enhancement)
   * @param {Object} payload - User data to include in token
   * @returns {string} - Refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.secret + '_refresh', {
      expiresIn: '7d', // Refresh tokens typically last longer
    });
  }
}

module.exports = AuthService;