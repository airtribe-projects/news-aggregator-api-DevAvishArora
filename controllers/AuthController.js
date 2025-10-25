const { body, validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');
const dataStore = require('../models/DataStore');
const { createResponse, createErrorResponse } = require('../utils/responseHelper');

/**
 * Authentication Controller
 * Handles user registration, login, and authentication-related operations
 */
class AuthController {
  /**
   * User Registration
   * POST /users/signup
   */
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { name, email, password, preferences = [] } = req.body;

      if (dataStore.userExists(email)) {
        return res.status(409).json(createErrorResponse(
          'User already exists',
          'A user with this email address already exists'
        ));
      }

      const passwordValidation = AuthService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json(createErrorResponse(
          'Password validation failed',
          passwordValidation.errors
        ));
      }

      const hashedPassword = await AuthService.hashPassword(password);

      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        preferences: Array.isArray(preferences) ? preferences : [],
      };

      const user = dataStore.createUser(userData);

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
      const token = AuthService.generateToken(tokenPayload);

      res.status(200).json(createResponse(
        'User registered successfully',
        {
          user: user.toJSON(),
          token,
        }
      ));
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred during registration'
      ));
    }
  }

  /**
   * User Login
   * POST /users/login
   */
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(createErrorResponse(
          'Validation failed',
          errors.array()
        ));
      }

      const { email, password } = req.body;

      const user = dataStore.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json(createErrorResponse(
          'Authentication failed',
          'Invalid email or password'
        ));
      }

      const isPasswordValid = await AuthService.comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json(createErrorResponse(
          'Authentication failed',
          'Invalid email or password'
        ));
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
      const token = AuthService.generateToken(tokenPayload);

      res.status(200).json(createResponse(
        'Login successful',
        {
          user: user.toJSON(),
          token,
        }
      ));
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred during login'
      ));
    }
  }

  /**
   * Get Current User Profile
   * GET /users/profile
   */
  static async getProfile(req, res) {
    try {
      const user = dataStore.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json(createErrorResponse(
          'User not found',
          'User profile not found'
        ));
      }

      res.status(200).json(createResponse(
        'Profile retrieved successfully',
        { user: user.toJSON() }
      ));
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json(createErrorResponse(
        'Internal server error',
        'An error occurred while retrieving profile'
      ));
    }
  }

  /**
   * Validation rules for registration
   */
  static getRegistrationValidation() {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must contain only letters and spaces'),
      
      body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('Email must not exceed 100 characters'),
      
      body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters'),
      
      body('preferences')
        .optional()
        .isArray()
        .withMessage('Preferences must be an array')
        .custom((preferences) => {
          if (preferences.length > 10) {
            throw new Error('Cannot have more than 10 preferences');
          }
          return true;
        }),
    ];
  }

  /**
   * Validation rules for login
   */
  static getLoginValidation() {
    return [
      body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
      
      body('password')
        .notEmpty()
        .withMessage('Password is required'),
    ];
  }
}

module.exports = AuthController;